output "kubernetes_ingress_ip" {
  value = azurerm_public_ip.ingress.ip_address
}

output "instrumentation_key" {
  value = azurerm_application_insights.main.instrumentation_key
}

output "postgres_disk_name" {
  value = azurerm_managed_disk.postgres.name
}

output "postgres_disk_id" {
  value = azurerm_managed_disk.postgres.id
}
