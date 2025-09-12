let deferredPrompt;

// Listener para o evento 'beforeinstallprompt'
// Este evento é disparado pelo navegador quando ele detecta que o site é um PWA instalável.
window.addEventListener('beforeinstallprompt', (event) => {
    // Evita que o prompt padrão do navegador seja exibido
    event.preventDefault();
    // Armazena o evento para que possamos dispará-lo mais tarde, com um clique no botão
    deferredPrompt = event;
    //console.log(`'beforeinstallprompt' event was fired.`);
    // Se desejar, você pode mostrar seu botão personalizado aqui
    // Exemplo: document.getElementById('installButton').style.display = 'block';
});

// Listener para o evento 'appinstalled'
// Isso é útil para saber se o usuário instalou o PWA
window.addEventListener('appinstalled', (event) => {
    //console.log('PWA foi instalado com sucesso!');
    // Você pode ocultar o botão de instalação aqui, pois o app já está instalado
});

/**
 * Esta função mostra o prompt de instalação para o usuário.
 * Ela só deve ser chamada após um clique de um botão.
 */
export function showInstallPrompt() {
    // Verifica se o evento está disponível e não foi consumido
    if (deferredPrompt) {
        // Dispara o prompt de instalação que o navegador guardou
        deferredPrompt.prompt();
        
        // Verifica a resposta do usuário
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                //console.log('Usuário aceitou a instalação do PWA.');
            } else {
                //console.log('Usuário recusou a instalação do PWA.');
            }
            // Limpa o evento para que não possa ser usado novamente
            deferredPrompt = null;
        });
    } else {
        //console.log('O prompt de instalação não está disponível no momento.');
    }
}
