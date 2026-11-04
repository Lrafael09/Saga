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

jarvis/jarvis.css

#jarvisRoot {
  font-family: Arial, sans-serif;
  color: #fff;
}

#jarvisToggle {
  position: fixed;
  right: 20px;
  bottom: 22px;
  z-index: 9998;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 1px solid #384c5c;
  background: #101c26;
  color: #9bdcff;
  font-size: 25px;
  font-weight: bold;
  box-shadow: 0 0 20px #0009;
  cursor: pointer;
}

.jarvis-panel {
  position: fixed;
  right: 15px;
  bottom: 92px;
  z-index: 9999;
  width: min(380px, calc(100vw - 30px));
  height: min(570px, calc(100dvh - 125px));
  background: #101214;
  border: 1px solid #303940;
  border-radius: 18px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 15px 50px #000b;
}

.jarvis-panel[hidden] {
  display: none;
}

.jarvis-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #171e23;
  border-bottom: 1px solid #303940;
}

.jarvis-avatar {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #1a3445;
  color: #9bdcff;
  font-size: 23px;
  font-weight: bold;
}

.jarvis-heading {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
}

.jarvis-heading strong {
  font-size: 15px;
  letter-spacing: 2px;
}

.jarvis-heading small {
  color: #91a0a9;
  font-size: 11px;
}

#jarvisClose {
  background: transparent;
  border: 0;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
}

.jarvis-welcome {
  padding: 18px 16px 10px;
}

.jarvis-welcome strong {
  font-size: 16px;
}

.jarvis-welcome p {
  margin-top: 7px;
  color: #a6b0b7;
  font-size: 13px;
}

.jarvis-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.jarvis-message {
  max-width: 88%;
  padding: 11px 13px;
  border-radius: 13px;
  font-size: 13px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.jarvis-message.user {
  align-self: flex-end;
  background: #1d394b;
  color: #fff;
  border-bottom-right-radius: 4px;
}

.jarvis-message.jarvis {
  align-self: flex-start;
  background: #24292d;
  color: #e8edf0;
  border-bottom-left-radius: 4px;
}

.jarvis-form {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #303940;
}

.jarvis-form input {
  min-width: 0;
  flex: 1;
  padding: 13px;
  border: 1px solid #38434a;
  border-radius: 10px;
  background: #1b2024;
  color: #fff;
  outline: none;
}

.jarvis-form input:focus {
  border-color: #73bce4;
}

.jarvis-form button {
  width: 45px;
  border: 0;
  border-radius: 10px;
  background: #1c3d50;
  color: #9bdcff;
  font-size: 20px;
  cursor: pointer;
}

.jarvis-footer {
  padding: 0 12px 12px;
  text-align: center;
  color: #64727b;
  font-size: 9px;
  letter-spacing: 2px;
}