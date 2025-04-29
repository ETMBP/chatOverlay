helm upgrade --install chatoverlay `
    --namespace chatoverlay `
    --create-namespace `
    --set frontendImage.tag="v0.1.12" `
    --set backendImage.tag="v0.1.12" `
    .\helm\chatoverlay