output "backend_app_service_name" {
  value = azurerm_linux_web_app.backend.name
}

output "frontend_app_service_name" {
  value = azurerm_linux_web_app.frontend.name
}

output "backend_url" {
  value = "https://${azurerm_linux_web_app.backend.default_hostname}"
}

output "frontend_url" {
  value = "https://${azurerm_linux_web_app.frontend.default_hostname}"
}