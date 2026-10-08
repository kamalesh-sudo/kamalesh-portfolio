(function () {
  'use strict';
  var KS = window.KS;

  function initTerminal() {
    var term = document.querySelector('[data-term]');
    if (!term) return;
    var log = term.querySelector('[data-term-log]');
    var form = term.querySelector('[data-term-form]');
    var input = form.querySelector('input');

    function print(text, cls) {
      var p = document.createElement('p');
      p.textContent = text;
      if (cls) p.className = cls;
      log.appendChild(p);
      while (log.children.length > 12) log.removeChild(log.firstChild);
      log.scrollTop = log.scrollHeight;
    }

    function openLink(key, label) {
      var url = KS.ph(key);
      if (!url) { print(label + ': link coming soon.'); return; }
      print('opening ' + label + ' ...', 'cmd-ok');
      window.open(url, '_blank', 'noopener');
    }

    var commands = {
      help: function () { print('commands: contact  github  linkedin  resume  help  clear'); },
      contact: function () {
        print('opening a channel. the form is ready.', 'cmd-ok');
        var field = document.querySelector('[data-contact-form] input[name="name"]');
        if (field) { field.scrollIntoView({ behavior: KS.reduced ? 'auto' : 'smooth', block: 'center' }); field.focus({ preventScroll: true }); }
      },
      github: function () { openLink('GITHUB_PROFILE_URL', 'github'); },
      linkedin: function () { openLink('LINKEDIN_URL', 'linkedin'); },
      resume: function () {
        var url = KS.ph('RESUME_URL');
        if (!url) { print('resume: coming soon. ask through the form in the meantime.'); return; }
        print('opening resume ...', 'cmd-ok');
        window.open(url, '_blank', 'noopener');
      },
      clear: function () { log.textContent = ''; }
    };

    function run(raw) {
      var cmd = String(raw || '').trim().toLowerCase();
      if (!cmd) return;
      print('$ ' + cmd, 'cmd-echo');
      if (commands[cmd]) commands[cmd]();
      else print('command not found: ' + cmd + '. try "help".');
    }

    print('system idle. type a command, or tap one below.');
    form.addEventListener('submit', function (e) { e.preventDefault(); run(input.value); input.value = ''; });
    term.querySelectorAll('[data-cmd]').forEach(function (b) {
      b.addEventListener('click', function () { run(b.getAttribute('data-cmd')); });
    });
  }

  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form || !window.fetch || !window.FormData) return;
    var status = form.querySelector('[data-form-status]');
    var button = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = 'Transmitting ...';
      button.disabled = true;
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          status.classList.add('is-ok');
          status.textContent = 'Message sent. Thank you.';
        })
        .catch(function () {
          status.classList.add('is-err');
          status.textContent = 'Could not send right now. Please try again in a moment.';
        })
        .then(function () { button.disabled = false; });
    });
  }

  KS.initFooter = function () {
    initTerminal();
    initContactForm();
  };
})();
