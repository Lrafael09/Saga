jarvis/jarvis.js

(() => {
  "use strict";

  const MEMORY_KEY = "sagaJarvisMemory";
  const CHAT_KEY = "sagaJarvisChat";

  const memory = JSON.parse(localStorage.getItem(MEMORY_KEY) || "[]");
  const history = JSON.parse(localStorage.getItem(CHAT_KEY) || "[]");
  const actions = {};

  function saveMemory() {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  }

  function saveChat() {
    localStorage.setItem(CHAT_KEY, JSON.stringify(history));
  }

  function addMessage(role, content) {
    history.push({
      role,
      content,
      date: new Date().toISOString()
    });

    // Mantém as últimas 100 mensagens
    if (history.length > 100) history.shift();

    saveChat();
    renderMessages();
  }

  function renderMessages() {
    const container = document.getElementById("jarvisMessages");
    if (!container) return;

    container.innerHTML = "";

    history.forEach(message => {
      const bubble = document.createElement("div");
      bubble.className = "jarvis-message " + message.role;
      bubble.textContent = message.content;
      container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
  }

  function respond(text) {
    addMessage("jarvis", text);
  }

  // Sistema para registrar funções que o JARVIS poderá executar.
  function registerAction(name, callback) {
    if (typeof callback !== "function") {
      throw new Error("A ação precisa ser uma função.");
    }

    actions[name] = callback;
  }

  // Executa uma ação registrada pelo próprio SAGA.
  async function executeAction(name, data = {}) {
    if (!actions[name]) {
      respond("Ainda não tenho acesso à função: " + name + ".");
      return false;
    }

    try {
      await actions[name](data);
      respond("Comando executado com sucesso.");
      return true;
    } catch (error) {
      console.error("Erro no JARVIS:", error);
      respond("Não consegui executar essa alteração. Tente novamente.");
      return false;
    }
  }

  function processMessage(message) {
    const text = message.trim();
    if (!text) return;

    addMessage("user", text);

    const lower = text.toLowerCase();

    // Ajuda
    if (lower === "ajuda" || lower === "help") {
      respond(
        "Sou o JARVIS, assistente do SAGA. " +
        "Minha estrutura está pronta para receber comandos, " +
        "guardar memórias e controlar as funções do sistema."
      );
      return;
    }

    // Salvar uma memória explicitamente solicitada
    if (lower.startsWith("lembre que ") ||
        lower.startsWith("lembre-se que ")) {

      const memoryText = text
        .replace(/^lembre(-se)? que /i, "")
        .trim();

      if (memoryText) {
        memory.push({
          text: memoryText,
          date: new Date().toISOString()
        });

        saveMemory();
        respond("Informação salva na minha memória.");
      }
      return;
    }

    // Consultar memória
    if (lower.includes("minhas memórias") ||
        lower.includes("o que você lembra")) {

      if (!memory.length) {
        respond("Ainda não tenho memórias salvas.");
      } else {
        respond(
          "Estas são as informações que tenho guardadas:\n" +
          memory.map((item, index) =>
            (index + 1) + ". " + item.text
          ).join("\n")
        );
      }
      return;
    }

    // Apagar memória exige confirmação.
    if (lower === "apagar minhas memórias") {
      const confirmed = confirm(
        "Tem certeza de que deseja apagar todas as memórias do JARVIS?"
      );

      if (confirmed) {
        memory.length = 0;
        saveMemory();
        respond("Memórias locais apagadas.");
      } else {
        respond("Tudo bem. Mantive suas memórias.");
      }
      return;
    }

    respond(
      "Entendi seu pedido. Minha interface está funcionando, " +
      "mas ainda preciso conectar a inteligência artificial e " +
      "as funções do SAGA para executar esse tipo de comando."
    );
  }

  function createInterface() {
    if (document.getElementById("jarvisRoot")) return;

    const root = document.createElement("div");
    root.id = "jarvisRoot";

    root.innerHTML = `
      <button id="jarvisToggle" aria-label="Abrir JARVIS">
        <span>J</span>
      </button>

      <section id="jarvisPanel" class="jarvis-panel" hidden>
        <header class="jarvis-header">
          <div class="jarvis-avatar">J</div>
          <div class="jarvis-heading">
            <strong>JARVIS</strong>
            <small>Assistente do SAGA</small>
          </div>
          <button id="jarvisClose" aria-label="Fechar">×</button>
        </header>

        <div class="jarvis-welcome">
          <strong>Olá. Sou o JARVIS.</strong>
          <p>Como posso ajudar no seu treinamento hoje?</p>
        </div>

        <div id="jarvisMessages" class="jarvis-messages"></div>

        <form id="jarvisForm" class="jarvis-form">
          <input
            id="jarvisInput"
            type="text"
            placeholder="Digite um comando..."
            autocomplete="off"
          />
          <button type="submit" aria-label="Enviar">➤</button>
        </form>

        <div class="jarvis-footer">
          SAGA WORKOUT SYSTEM
        </div>
      </section>
    `;

    document.body.appendChild(root);

    const panel = document.getElementById("jarvisPanel");

    document.getElementById("jarvisToggle").onclick = () => {
      panel.hidden = !panel.hidden;
    };

    document.getElementById("jarvisClose").onclick = () => {
      panel.hidden = true;
    };

    document.getElementById("jarvisForm").onsubmit = event => {
      event.preventDefault();

      const input = document.getElementById("jarvisInput");
      processMessage(input.value);
      input.value = "";
    };

    renderMessages();
  }

  // Disponibiliza a integração para o restante do SAGA.
  window.JARVIS = {
    registerAction,
    executeAction,
    processMessage,

    getMemory() {
      return [...memory];
    },

    getHistory() {
      return [...history];
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createInterface);
  } else {
    createInterface();
  }
})();

(() => {
  "use strict";

  const MEMORY_KEY = "sagaJarvisMemory";
  const CHAT_KEY = "sagaJarvisChat";

  const memory = JSON.parse(localStorage.getItem(MEMORY_KEY) || "[]");
  const history = JSON.parse(localStorage.getItem(CHAT_KEY) || "[]");
  const actions = {};

  function saveMemory() {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  }

  function saveChat() {
    localStorage.setItem(CHAT_KEY, JSON.stringify(history));
  }

  function addMessage(role, content) {
    history.push({
      role,
      content,
      date: new Date().toISOString()
    });

    // Mantém as últimas 100 mensagens
    if (history.length > 100) history.shift();

    saveChat();
    renderMessages();
  }

  function renderMessages() {
    const container = document.getElementById("jarvisMessages");
    if (!container) return;

    container.innerHTML = "";

    history.forEach(message => {
      const bubble = document.createElement("div");
      bubble.className = "jarvis-message " + message.role;
      bubble.textContent = message.content;
      container.appendChild(bubble);
    });

    container.scrollTop = container.scrollHeight;
  }

  function respond(text) {
    addMessage("jarvis", text);
  }

  // Sistema para registrar funções que o JARVIS poderá executar.
  function registerAction(name, callback) {
    if (typeof callback !== "function") {
      throw new Error("A ação precisa ser uma função.");
    }

    actions[name] = callback;
  }

  // Executa uma ação registrada pelo próprio SAGA.
  async function executeAction(name, data = {}) {
    if (!actions[name]) {
      respond("Ainda não tenho acesso à função: " + name + ".");
      return false;
    }

    try {
      await actions[name](data);
      respond("Comando executado com sucesso.");
      return true;
    } catch (error) {
      console.error("Erro no JARVIS:", error);
      respond("Não consegui executar essa alteração. Tente novamente.");
      return false;
    }
  }

  function processMessage(message) {
    const text = message.trim();
    if (!text) return;

    addMessage("user", text);

    const lower = text.toLowerCase();

    // Ajuda
    if (lower === "ajuda" || lower === "help") {
      respond(
        "Sou o JARVIS, assistente do SAGA. " +
        "Minha estrutura está pronta para receber comandos, " +
        "guardar memórias e controlar as funções do sistema."
      );
      return;
    }

    // Salvar uma memória explicitamente solicitada
    if (lower.startsWith("lembre que ") ||
        lower.startsWith("lembre-se que ")) {

      const memoryText = text
        .replace(/^lembre(-se)? que /i, "")
        .trim();

      if (memoryText) {
        memory.push({
          text: memoryText,
          date: new Date().toISOString()
        });

        saveMemory();
        respond("Informação salva na minha memória.");
      }
      return;
    }

    // Consultar memória
    if (lower.includes("minhas memórias") ||
        lower.includes("o que você lembra")) {

      if (!memory.length) {
        respond("Ainda não tenho memórias salvas.");
      } else {
        respond(
          "Estas são as informações que tenho guardadas:\n" +
          memory.map((item, index) =>
            (index + 1) + ". " + item.text
          ).join("\n")
        );
      }
      return;
    }

    // Apagar memória exige confirmação.
    if (lower === "apagar minhas memórias") {
      const confirmed = confirm(
        "Tem certeza de que deseja apagar todas as memórias do JARVIS?"
      );

      if (confirmed) {
        memory.length = 0;
        saveMemory();
        respond("Memórias locais apagadas.");
      } else {
        respond("Tudo bem. Mantive suas memórias.");
      }
      return;
    }

    respond(
      "Entendi seu pedido. Minha interface está funcionando, " +
      "mas ainda preciso conectar a inteligência artificial e " +
      "as funções do SAGA para executar esse tipo de comando."
    );
  }

  function createInterface() {
    if (document.getElementById("jarvisRoot")) return;

    const root = document.createElement("div");
    root.id = "jarvisRoot";

    root.innerHTML = `
      <button id="jarvisToggle" aria-label="Abrir JARVIS">
        <span>J</span>
      </button>

      <section id="jarvisPanel" class="jarvis-panel" hidden>
        <header class="jarvis-header">
          <div class="jarvis-avatar">J</div>
          <div class="jarvis-heading">
            <strong>JARVIS</strong>
            <small>Assistente do SAGA</small>
          </div>
          <button id="jarvisClose" aria-label="Fechar">×</button>
        </header>

        <div class="jarvis-welcome">
          <strong>Olá. Sou o JARVIS.</strong>
          <p>Como posso ajudar no seu treinamento hoje?</p>
        </div>

        <div id="jarvisMessages" class="jarvis-messages"></div>

        <form id="jarvisForm" class="jarvis-form">
          <input
            id="jarvisInput"
            type="text"
            placeholder="Digite um comando..."
            autocomplete="off"
          />
          <button type="submit" aria-label="Enviar">➤</button>
        </form>

        <div class="jarvis-footer">
          SAGA WORKOUT SYSTEM
        </div>
      </section>
    `;

    document.body.appendChild(root);

    const panel = document.getElementById("jarvisPanel");

    document.getElementById("jarvisToggle").onclick = () => {
      panel.hidden = !panel.hidden;
    };

    document.getElementById("jarvisClose").onclick = () => {
      panel.hidden = true;
    };

    document.getElementById("jarvisForm").onsubmit = event => {
      event.preventDefault();

      const input = document.getElementById("jarvisInput");
      processMessage(input.value);
      input.value = "";
    };

    renderMessages();
  }

  // Disponibiliza a integração para o restante do SAGA.
  window.JARVIS = {
    registerAction,
    executeAction,
    processMessage,

    getMemory() {
      return [...memory];
    },

    getHistory() {
      return [...history];
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createInterface);
  } else {
    createInterface();
  }
})();