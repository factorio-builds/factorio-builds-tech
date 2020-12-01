variable "name" {
  type    = string
  default = "factorio-tech"
}

variable "subscription_id" {
  type    = string
}

variable "kubernetes_version" {
  type    = string
}

variable "location" {
  type    = string
}

variable "postgres_disk_size_gb" {
  type    = number
}
