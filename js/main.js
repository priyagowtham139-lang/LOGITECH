// Stackly - main script
(function() {
  var d = document,
    $ = function(s, c) {
      return (c || d).querySelector(s)
    },
    $$ = function(s, c) {
      return [].slice.call((c || d).querySelectorAll(s))
    };
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  var ry = sessionStorage.getItem('sk_ry');
  if (ry !== null) {
    sessionStorage.removeItem('sk_ry');
    var go = function() {
      window.scrollTo(0, +ry)
    };
    go();
    d.addEventListener('DOMContentLoaded', go);
    window.addEventListener('load', function() {
      go();
      setTimeout(go, 150)
    })
  }
  window.addEventListener('load', function() {
    setTimeout(function() {
      var l = $('#ld');
      if (l) l.classList.add('h')
    }, ry !== null ? 100 : 1900)
  });
  var ov = $('.ov');

  function tg(el, btn, on) {
    var o = on === undefined ? !el.classList.contains('o') : on;
    el.classList.toggle('o', o);
    if (ov) ov.classList.toggle('o', o);
    if (btn) btn.classList.toggle('x', o);
    d.body.style.overflow = o ? 'hidden' : ''
  }
  var bg = $('#bg'),
    nv = $('#nv');
  if (bg && nv) {
    bg.onclick = function() {
      tg(nv, bg)
    };
    $$('.cl', nv).forEach(function(c) {
      c.onclick = function() {
        tg(nv, bg, false)
      }
    })
  }
  var dg = $('#dbg'),
    sd = $('.sd');
  if (dg && sd) {
    dg.onclick = function() {
      tg(sd, null)
    };
    $$('.cl', sd).forEach(function(c) {
      c.onclick = function() {
        tg(sd, null, false)
      }
    })
  }
  if (ov) ov.onclick = function() {
    if (nv) tg(nv, bg, false);
    if (sd) tg(sd, null, false)
  };
  var pfName = $('#pfName'),
    pfMail = $('#pfMail'),
    pfAv = $('#pfAv');
  if (pfName || pfMail || pfAv) {
    var pfEmail = (sessionStorage.getItem('sk_email') || '').trim(),
      pfStored = (sessionStorage.getItem('sk_name') || '').trim(),
      pfUser = pfStored || (pfEmail ? pfEmail.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, function(c) {
        return c.toUpperCase()
      }) : (sessionStorage.getItem('sk_role') === 'admin' ? 'Stackly Admin' : 'Stackly User'));
    if (pfName) pfName.textContent = pfUser;
    if (pfMail) pfMail.textContent = pfEmail || (sessionStorage.getItem('sk_role') === 'admin' ? 'admin@stackly.com' : 'guest@stackly.com');
    if (pfAv) pfAv.textContent = pfUser.trim().charAt(0).toUpperCase() || 'S'
  }
  var views = $$('.view'),
    pageTitle = $('#pageTitle'),
    mTitle = $('#mTitle');
  if (views.length) {
    var openView = function(v) {
      var target = $('.view[data-view="' + v + '"]');
      if (!target) return false;
      views.forEach(function(s) {
        s.classList.toggle('on', s === target)
      });
      $$('.sd a[data-view]').forEach(function(a) {
        a.classList.toggle('on', a.getAttribute('data-view') === v)
      });
      if (pageTitle) pageTitle.textContent = target.getAttribute('data-title') || v;
      if (mTitle) mTitle.textContent = target.getAttribute('data-title') || v;
      if (sd && sd.classList.contains('o')) tg(sd, null, false);
      var mn = $('.mn');
      if (mn) mn.scrollTop = 0;
      window.scrollTo(0, 0);
      return true
    };
    d.addEventListener('click', function(e) {
      var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null;
      if (!a) return;
      var raw = a.getAttribute('href');
      if (raw === '#') {
        e.preventDefault();
        return
      }
      var v = raw.slice(1);
      if (!v || !$('.view[data-view="' + v + '"]')) return;
      e.preventDefault();
      if (openView(v) && history.replaceState) history.replaceState(null, '', '#' + v)
    });
    var h = location.hash.replace('#', '');
    if (!h || !openView(h)) openView('overview')
  }
  window.addEventListener('resize', function() {
    if (innerWidth > 960) {
      if (nv) tg(nv, bg, false);
      if (sd) tg(sd, null, false)
    }
  });
  var io = new IntersectionObserver(function(e) {
    e.forEach(function(x) {
      if (x.isIntersecting) {
        x.target.classList.add('in');
        io.unobserve(x.target)
      }
    })
  }, {
    threshold: .1
  });
  $$('[data-a]').forEach(function(e, i) {
    e.style.transitionDelay = (i % 4) * 90 + 'ms';
    io.observe(e)
  });
  $$('.cd').forEach(function(c) {
    c.addEventListener('pointermove', function(e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--x', e.clientX - r.left + 'px');
      c.style.setProperty('--y', e.clientY - r.top + 'px')
    })
  });
  $$('[data-n]').forEach(function(el) {
    var t = +el.dataset.n,
      s = el.dataset.s || '',
      o = new IntersectionObserver(function(e) {
        if (e[0].isIntersecting) {
          var st = null;
          (function f(ts) {
            st = st || ts;
            var p = Math.min((ts - st) / 1500, 1);
            el.textContent = Math.floor(t * p).toLocaleString() + s;
            if (p < 1) requestAnimationFrame(f)
          })(performance.now());
          o.disconnect()
        }
      });
    o.observe(el)
  });
  $$('.eye').forEach(function(b) {
    b.onclick = function() {
      var i = $('input', b.parentNode),
        s = i.type === 'password';
      i.type = s ? 'text' : 'password';
      b.textContent = s ? 'Hide' : 'Show';
      b.setAttribute('aria-pressed', s)
    }
  });
  $$('.tb[data-tabs] button').forEach(function(b) {
    b.onclick = function() {
      $$('button', b.parentNode).forEach(function(x) {
        x.classList.remove('on')
      });
      b.classList.add('on');
      $$('[data-p]').forEach(function(p) {
        p.classList.toggle('hid', p.dataset.p !== b.dataset.t)
      })
    }
  });
  var role = 'user';
  $$('.tb[data-role] button').forEach(function(b) {
    b.onclick = function() {
      $$('button', b.parentNode).forEach(function(x) {
        x.classList.remove('on')
      });
      b.classList.add('on');
      role = b.dataset.r
    }
  });
  $$('[data-switch]').forEach(function(a) {
    a.onclick = function(e) {
      e.preventDefault();
      var t = $('.tb[data-tabs] button[data-t="' + a.dataset.switch + '"]');
      if (t) t.click()
    }
  });
  var pw2 = $('#p2'),
    mbar = $('#mbar'),
    mtxt = $('#mtxt'),
    pwa = $('#pwalert');
  var score = function(v) {
    var s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/\d/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    return Math.min(s, 4)
  };
  var markPw = function() {
    var v = pw2.value,
      s = score(v),
      i = Math.max(s - 1, 0);
    if (mbar) {
      mbar.style.width = (v ? s / 4 * 100 : 0) + '%';
      mbar.style.background = ['#ef4444', '#f97316', '#facc15', '#22c55e'][i]
    }
    if (mtxt) mtxt.hidden = v !== '';
    if (pwa) {
      if (!v) pwa.hidden = true;
      else if (s >= 3) {
        pwa.hidden = false;
        pwa.className = 'pwalert ok';
        pwa.textContent = 'Strong password'
      } else {
        pwa.hidden = false;
        pwa.className = s === 2 ? 'pwalert' : 'pwalert no';
        pwa.textContent = s === 2 ? 'Medium password — add an uppercase letter or a symbol' : 'Weak password — use 8+ characters with uppercase, numbers and symbols'
      }
    }
  };
  if (pw2 && mbar) pw2.addEventListener('input', markPw);
  var gmail = /^[^\s@]+@(gmail|googlemail)\.com$/i;
  var lf = $('#lf');
  if (lf) {
    var le = $('#lemail'),
      lee = $('#lemailErr'),
      chkMail2 = function() {
        var v = le.value.trim(),
          bad = v !== '' && !gmail.test(v);
        if (lee) lee.hidden = !bad;
        le.classList.toggle('bad', bad);
        le.setAttribute('aria-invalid', bad ? 'true' : 'false')
      };
    if (le) {
      le.addEventListener('input', chkMail2);
      le.addEventListener('blur', chkMail2)
    }
    lf.onsubmit = function(e) {
      e.preventDefault();
      if (le) chkMail2();
      if (le && gmail.test(le.value.trim())) {
        sessionStorage.setItem('sk_email', le.value.trim());
        sessionStorage.setItem('sk_role', role);
        location.href = role === 'admin' ? 'admin-dashboard.html' : 'user-dashboard.html'
      }
    }
  }
  var sf = $('#sf');
  if (sf) {
    var sn = $('#sname'),
      sne = $('#snameErr'),
      se = $('#semail'),
      see = $('#semailErr'),
      p3 = $('#p3'),
      p3e = $('#p3Err'),
      tos = $('#tos'),
      tose = $('#tosErr'),
      chkName2 = function() {
        var bad = /[^A-Za-z\s]/.test(sn.value);
        if (sne) sne.hidden = !bad;
        sn.classList.toggle('bad', bad);
        sn.setAttribute('aria-invalid', bad ? 'true' : 'false')
      },
      chkMail3 = function() {
        var v = se.value.trim(),
          bad = v !== '' && !gmail.test(v);
        if (see) see.hidden = !bad;
        se.classList.toggle('bad', bad);
        se.setAttribute('aria-invalid', bad ? 'true' : 'false')
      };
    if (sn && sne) {
      sn.addEventListener('input', chkName2);
      sn.addEventListener('blur', chkName2)
    }
    if (se && see) {
      se.addEventListener('input', chkMail3);
      se.addEventListener('blur', chkMail3)
    }
    if (p3 && p3e) p3.addEventListener('input', function() {
      var bad = p3.value !== pw2.value;
      p3e.hidden = !bad;
      p3.classList.toggle('bad', bad)
    });
    if (tos && tose) tos.addEventListener('change', function() {
      tose.hidden = tos.checked
    });
    sf.onsubmit = function(e) {
      e.preventDefault();
      var ok = true;
      if (sn && sne) {
        chkName2();
        if (!/^[A-Za-z\s]+$/.test(sn.value.trim())) ok = false
      }
      if (se && see) {
        chkMail3();
        if (!gmail.test(se.value.trim())) ok = false
      }
      if (pw2) {
        markPw();
        if (score(pw2.value) < 2) {
          if (pwa) {
            pwa.hidden = false;
            pwa.className = 'pwalert no';
            pwa.textContent = 'Please choose a stronger password (8+ characters with uppercase, numbers or symbols)'
          }
          ok = false
        }
      }
      if (p3 && p3e) {
        var bad = !p3.value || p3.value !== pw2.value;
        p3e.hidden = !bad;
        p3.classList.toggle('bad', bad);
        if (bad) ok = false
      }
      if (tos && tose) {
        var tbad = !tos.checked;
        tose.hidden = !tbad;
        if (tbad) ok = false
      }
      if (ok) {
        sessionStorage.setItem('sk_name', sn.value.trim());
        sessionStorage.setItem('sk_email', se.value.trim());
        g404()
      }
    }
  }
  var saveSpot = function() {
    sessionStorage.setItem('sk_url', location.href);
    sessionStorage.setItem('sk_y', window.pageYOffset)
  };
  var g404 = function() {
    saveSpot();
    location.href = '404.html'
  };
  d.addEventListener('click', function(e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    if (/(^|\/)404\.html$/i.test(a.getAttribute('href') || '')) saveSpot()
  });
  $$('.sbtn').forEach(function(b) {
    b.onclick = g404
  });
  var gb = $('#back');
  if (gb) gb.onclick = function() {
    var u = sessionStorage.getItem('sk_url'),
      y = sessionStorage.getItem('sk_y');
    sessionStorage.removeItem('sk_url');
    sessionStorage.removeItem('sk_y');
    if (u) {
      sessionStorage.setItem('sk_ry', y || 0);
      location.href = u
    } else if (history.length > 1) history.back();
    else location.href = 'index.html'
  };
  var ft = $('.ft'),
    tgb = $('.tg');
  if (tgb) tgb.onclick = function() {
    ft.classList.toggle('open');
    tgb.setAttribute('aria-expanded', ft.classList.contains('open'))
  };
  $$('form.sr').forEach(function(f) {
    f.onsubmit = function(e) {
      e.preventDefault()
    }
  });
  var cn = $('#cname');
  if (cn) {
    var cne = $('#cnameErr'),
      checkName = function() {
        var bad = /[^A-Za-z\s]/.test(cn.value);
        if (cne) cne.hidden = !bad;
        cn.classList.toggle('bad', bad);
        cn.setAttribute('aria-invalid', bad ? 'true' : 'false')
      };
    cn.addEventListener('input', checkName);
    cn.addEventListener('blur', checkName)
  }
  var ce = $('#cemail');
  if (ce) {
    var cee = $('#cemailErr'),
      checkMail = function() {
        var v = ce.value.trim(),
          bad = v !== '' && !/^[^\s@]+@(gmail|googlemail)\.com$/i.test(v);
        if (cee) cee.hidden = !bad;
        ce.classList.toggle('bad', bad);
        ce.setAttribute('aria-invalid', bad ? 'true' : 'false')
      };
    ce.addEventListener('input', checkMail);
    ce.addEventListener('blur', checkMail)
  }
  var cf = $('#cform');
  if (cf) cf.onsubmit = function(e) {
    e.preventDefault();
    if (typeof checkName === 'function') checkName();
    if (typeof checkMail === 'function') checkMail();
    var nameBad = !/^[A-Za-z\s]+$/.test((cn ? cn.value : '').trim()),
      mailBad = !/^[^\s@]+@(gmail|googlemail)\.com$/i.test((ce ? ce.value : '').trim());
    if (!nameBad && !mailBad) g404()
  }
})();
