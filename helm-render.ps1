helm template chatoverlay `
    --namespace chatoverlay `
    --create-namespace `
    --set backend.skip=false `
    --set frontend.skip=false `
    --set-json 'frontendIngress.tls=[{"hosts":["chatoverlay-medve.etmbp.lo"],"secretName":"chatoverlay-medve-tls"}]' `
    .\helm\chatoverlay