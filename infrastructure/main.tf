###
# PROVIDERS
#

provider "azurerm" {
   features {}
   subscription_id = var.subscription_id
}

provider "kubernetes" {
  load_config_file = "false"
  host             = azurerm_kubernetes_cluster.main.kube_config.0.host

  client_key             = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.client_key)
  client_certificate     = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.client_certificate)
  cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.cluster_ca_certificate)
}

provider "helm" {
  kubernetes {
    load_config_file = "false"
    host             = azurerm_kubernetes_cluster.main.kube_config.0.host

    client_key             = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.client_key)
    client_certificate     = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.client_certificate)
    cluster_ca_certificate = base64decode(azurerm_kubernetes_cluster.main.kube_config.0.cluster_ca_certificate)
  }
}

###
# STATIC RESOURCES
#

resource "azurerm_resource_group" "main" {
  name     = var.name
  location = var.location
}

resource "azurerm_storage_account" "main" {
  name                     = "factoriotech"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_storage_share" "factorio_data" {
  name                 = "factorio-data"
  storage_account_name = azurerm_storage_account.main.name
  quota                = 2 // GiB
}

resource "azurerm_storage_share" "app_data" {
  name                 = "app-data"
  storage_account_name = azurerm_storage_account.main.name
  quota                = 10 // GiB
}

resource "azurerm_log_analytics_workspace" "main" {
  name                = "${var.name}-oms"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Free" //"PerGB2018"
}

resource "azurerm_log_analytics_solution" "main" {
  solution_name         = "Containers"
  workspace_resource_id = azurerm_log_analytics_workspace.main.id
  workspace_name        = azurerm_log_analytics_workspace.main.name
  location              = azurerm_resource_group.main.location
  resource_group_name   = azurerm_resource_group.main.name

  plan {
    publisher = "Microsoft"
    product   = "OMSGallery/Containers"
  }
}

resource "azurerm_application_insights" "main" {
  name                = var.name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  application_type    = "web"
}

resource "azurerm_public_ip" "ingress" {
  name                = "${var.name}-ingress"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                 = "Basic"
}

resource "azurerm_managed_disk" "postgres" {
  name                 = "${var.name}-postgres"
  location             = azurerm_resource_group.main.location
  resource_group_name  = azurerm_resource_group.main.name
  storage_account_type = "StandardSSD_LRS"
  create_option        = "Empty"
  disk_size_gb         = var.postgres_disk_size_gb
}

###
# KUBERNETES
#

resource "azurerm_kubernetes_cluster" "main" {
  name                = var.name
  dns_prefix          = var.name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  node_resource_group = "${azurerm_resource_group.main.name}-aks-mc"
  kubernetes_version  = var.kubernetes_version

  default_node_pool {
    name                 = "default"
    node_count           = 1
    vm_size              = "Standard_B2s"
    os_disk_size_gb      = 30
    orchestrator_version = var.kubernetes_version
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin = "kubenet"
    load_balancer_sku = "Basic"
  }

  role_based_access_control {
    enabled = true
  }

  addon_profile {
    aci_connector_linux {
      enabled = false
    }

    azure_policy {
      enabled = false
    }

    http_application_routing {
      enabled = false
    }

    oms_agent {
      enabled                    = true
      log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
    }
  }
}

resource "azurerm_role_assignment" "kubernetes_to_ingress_ip" {
  scope                = azurerm_public_ip.ingress.id
  principal_id         = azurerm_kubernetes_cluster.main.identity.0.principal_id
  role_definition_name = "Contributor"
}

resource "azurerm_role_assignment" "kubernetes_to_storage" {
  scope                = azurerm_storage_account.main.id
  principal_id         = azurerm_kubernetes_cluster.main.identity.0.principal_id
  role_definition_name = "Contributor"
}

resource "azurerm_role_assignment" "kubernetes_to_postgres_disk" {
  scope                = azurerm_managed_disk.postgres.id
  principal_id         = azurerm_kubernetes_cluster.main.identity.0.principal_id
  role_definition_name = "Contributor"
}

###
# CLUSTER RESOURCES
#

resource "helm_release" "kubernetes-dashboard" {
  name       = "kubernetes-dashboard"
  repository = "https://kubernetes.github.io/dashboard"
  chart      = "kubernetes-dashboard"
  # version    = "3.0.0"
}

resource "helm_release" "traefik" {
  name       = "traefik"
  repository = "https://helm.traefik.io/traefik"
  chart      = "traefik"
  # version    = "9.11.0"

  values = [
    file("traefik.values.yaml")
  ]

  set {
    name  = "service.spec.loadBalancerIP"
    value = azurerm_public_ip.ingress.ip_address
  }

  set {
    name = "service.annotations.service\\.beta\\.kubernetes\\.io/azure-load-balancer-resource-group"
    value = azurerm_resource_group.main.name
  }
}

resource "kubernetes_cluster_role_binding" "kubernetes_dasboard" {
  metadata {
    name = "kubernetes-dashboard"
  }

  role_ref {
    api_group = "rbac.authorization.k8s.io"
    kind      = "ClusterRole"
    name      = "cluster-admin"
  }

  subject {
    kind      = "ServiceAccount"
    name      = "kubernetes-dashboard"
  }

  subject {
    kind      = "User"
    name      = "clusterUser"
  }
}

resource "kubernetes_config_map" "postgres" {
  metadata {
    name = "postgres-data-disk"
  }

  data = {
    id   = azurerm_managed_disk.postgres.id
    name = azurerm_managed_disk.postgres.name
  }
}

resource "kubernetes_secret" "application_insights" {
  metadata {
    name = "application-insights"
  }

  data = {
    instrumentation_key = azurerm_application_insights.main.instrumentation_key
  }
}

resource "kubernetes_secret" "factorio_data" {
  metadata {
    name = "factorio-data-share"
  }

  data = {
    azurestorageaccountname = azurerm_storage_account.main.name
    azurestorageaccountkey = azurerm_storage_account.main.primary_access_key
  }
}

resource "kubernetes_secret" "app_data" {
  metadata {
    name = "app-data-share"
  }

  data = {
    azurestorageaccountname = azurerm_storage_account.main.name
    azurestorageaccountkey = azurerm_storage_account.main.primary_access_key
  }
}

resource "kubernetes_secret" "container_registry" {
  metadata {
    name = "default-container-registry"
  }

  data = {
    ".dockerconfigjson" = <<DOCKER
{
  "auths": {
    "${var.container_registry_server}": {
      "auth": "${base64encode("${var.container_registry_username}:${var.container_registry_password}")}"
    }
  }
}
DOCKER
  }

  type = "kubernetes.io/dockerconfigjson"
}
