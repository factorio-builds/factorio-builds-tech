variable "subscription_id" {
  type    = string
}

variable "name" {
  type    = string
  default = "factorio-tech"
}

variable "location" {
  type    = string
  default = "West Europe"
}

variable "kubernetes_version" {
  type    = string
  default = "1.19.3"
}

variable "postgres_disk_size_gb" {
  type    = number
  default = 16
}

variable "container_registry_server" {
  type    = string
  default = "ghcr.io"
}

variable "container_registry_username" {
  type    = string
}

variable "container_registry_password" {
  type      = string
  sensitive = true
}

variable "cloudflare_api_token" {
  type      = string
  sensitive = true
}
