helm template chatoverlay `
    --namespace chatoverlay `
    --create-namespace `
    --set backend.skip=false `
    --set frontend.skip=true `
    .\helm\chatoverlay