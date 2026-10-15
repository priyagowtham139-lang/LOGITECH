// Stackly - extra effects
(function() {
  var d = document,
    $ = function(s, c) {
      return (c || d).querySelector(s)
    },
    $$ = function(s, c) {
      return [].slice.call((c || d).querySelectorAll(s))
    };
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches,
    fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  /* scroll progress, sticky header state, back-to-top (rAF throttled) */
  var bar = d.createElement('div');
  bar.id = 'sp';
  d.body.appendChild(bar);
  var tt = d.createElement('button');
  tt.id = 'tt';
  tt.setAttribute('aria-label', 'Back to top');
  tt.innerHTML = '<span class="up"></span>';
  d.body.appendChild(tt);
  tt.onclick = function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  };
  var hd = $('.hd'),
    tk = false,
    blobs = $$('.blob');

  function up() {
    var y = window.pageYOffset,
      h = d.documentElement.scrollHeight - innerHeight;
    bar.style.width = (h > 0 ? y / h * 100 : 0) + '%';
    tt.classList.toggle('s', y > 600);
    if (hd) hd.classList.toggle('sc', y > 20);
    if (!rm) blobs.forEach(function(b, i) {
      b.style.transform = 'translateY(' + (y * (i ? -.08 : .1)) + 'px)'
    });
    tk = false
  }
  window.addEventListener('scroll', function() {
    if (!tk) {
      tk = true;
      requestAnimationFrame(up)
    }
  }, {
    passive: true
  });
  up();
  /* cursor glow */
  if (fine && !rm && !$('.db')) {
    var g = d.createElement('div');
    g.id = 'cg';
    d.body.appendChild(g);
    window.addEventListener('pointermove', function(e) {
      g.style.opacity = 1;
      g.style.transform = 'translate(' + e.clientX + 'px,' + e.clientY + 'px)'
    }, {
      passive: true
    });
    d.addEventListener('mouseleave', function() {
      g.style.opacity = 0
    })
  }
  /* 3D tilt + magnetic buttons (desktop pointers only) */
  if (fine && !rm) {
    $$('.cd').forEach(function(c) {
      if (c.closest('.tl') || c.closest('.ab')) return;
      c.classList.add('tl3');
      c.addEventListener('pointermove', function(e) {
        var r = c.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width - .5,
          y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = 'perspective(800px) rotateY(' + x * 10 + 'deg) rotateX(' + (-y * 10) + 'deg) translateY(-8px)'
      });
      c.addEventListener('pointerleave', function() {
        c.style.transform = ''
      })
    });
    $$('.btn').forEach(function(b) {
      b.addEventListener('pointermove', function(e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (e.clientX - r.left - r.width / 2) * .2 + 'px,' + (e.clientY - r.top - r.height / 2) * .3 + 'px)'
      });
      b.addEventListener('pointerleave', function() {
        b.style.transform = ''
      })
    })
  }
  /* ripple */
  $$('.btn,.ib').forEach(function(b) {
    b.addEventListener('click', function(e) {
      var r = b.getBoundingClientRect(),
        s = d.createElement('span'),
        z = Math.max(r.width, r.height) / 4;
      s.className = 'rp';
      s.style.cssText = 'width:' + z + 'px;height:' + z + 'px;left:' + (e.clientX - r.left - z / 2) + 'px;top:' + (e.clientY - r.top - z / 2) + 'px';
      b.style.position = b.style.position || 'relative';
      b.appendChild(s);
      setTimeout(function() {
        s.remove()
      }, 650)
    })
  });
  /* split-word headline reveal */
  var h1 = $('.hero h1');
  if (h1 && !rm) {
    var i = 0;
    (function w(n) {
      [].slice.call(n.childNodes).forEach(function(c) {
        if (c.nodeType === 3) {
          var f = d.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function(t) {
            if (!t.trim()) {
              f.appendChild(d.createTextNode(t));
              return
            }
            var s = d.createElement('span');
            s.className = 'wd';
            s.textContent = t;
            s.style.animationDelay = 2 + i++ * .07 + 's';
            f.appendChild(s)
          });
          c.replaceWith(f)
        } else if (c.nodeType === 1 && c.id !== 'ty') w(c)
      })
    })(h1);
    h1.removeAttribute('data-a');
    h1.style.opacity = 1;
    h1.style.transform = 'none'
  }
  /* typed rotating word */
  var ty = $('#ty');
  if (ty && !rm) {
    var ws = ty.dataset.w.split('|'),
      wi = 0,
      ci = ws[0].length,
      del = true,
      cur = d.createElement('span');
    cur.className = 'cur';
    ty.after(cur);
    (function t() {
      var w = ws[wi];
      ty.textContent = w.slice(0, ci);
      if (del) {
        ci--;
        if (ci < 0) {
          del = false;
          wi = (wi + 1) % ws.length;
          ci = 0
        }
        setTimeout(t, 45)
      } else {
        ci++;
        if (ci > ws[wi].length) {
          del = true;
          ci = ws[wi].length;
          setTimeout(t, 1800)
        } else setTimeout(t, 90)
      }
    })()
  }
  /* h2 underline trigger */
  var o2 = new IntersectionObserver(function(e) {
    e.forEach(function(x) {
      if (x.isIntersecting) {
        x.target.classList.add('in');
        o2.unobserve(x.target)
      }
    })
  }, {
    threshold: .5
  });
  $$('section h2').forEach(function(h) {
    o2.observe(h)
  });
  /* animated SVG background for page heroes (nav pages, not home) */
  var pgSvg = '<svg class="pg-svg" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">' +
    '<g fill="none" stroke="#ef4444" stroke-width="2">' +
    '<path class="rt" d="M-40 330C260 120 520 380 780 210S1240 60 1480 190"/>' +
    '<path class="rt" d="M-40 200C240 40 560 300 880 150S1260 280 1480 120" stroke="#f97316"/>' +
    '<path class="rt" d="M-40 120C300 320 640 60 960 260S1320 160 1480 300"/>' +
    '</g>' +
    '<g fill="#f97316">' +
    '<circle cx="160" cy="270" r="5"/>' +
    '<circle cx="780" cy="210" r="5"/>' +
    '<circle cx="1240" cy="120" r="5"/>' +
    '</g>' +
    '<g>' +
    '<circle r="6" fill="#ef4444"><animateMotion dur="9s" repeatCount="indefinite" path="M-40 330C260 120 520 380 780 210S1240 60 1480 190"/></circle>' +
    '<circle r="5" fill="#f97316"><animateMotion dur="12s" begin="-4s" repeatCount="indefinite" path="M-40 200C240 40 560 300 880 150S1260 280 1480 120"/></circle>' +
    '<circle r="5" fill="#ef4444"><animateMotion dur="11s" begin="-7s" repeatCount="indefinite" path="M-40 120C300 320 640 60 960 260S1320 160 1480 300"/></circle>' +
    '</g>' +
    '<g fill="none" stroke="#ef4444">' +
    '<circle cx="780" cy="210" r="6"><animate attributeName="r" values="6;22" dur="2.4s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="2.4s" repeatCount="indefinite"/></circle>' +
    '<circle cx="1240" cy="120" r="6"><animate attributeName="r" values="6;22" dur="2.4s" begin="-1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values=".8;0" dur="2.4s" begin="-1.2s" repeatCount="indefinite"/></circle>' +
    '</g>' +
    '</svg>';
  $$('.page').forEach(function(p) {
    p.insertAdjacentHTML('afterbegin', pgSvg)
  });
  /* marquee duplicate for seamless loop */
  $$('.mq div').forEach(function(m) {
    m.innerHTML += m.innerHTML
  });
})();
