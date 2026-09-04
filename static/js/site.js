/**
 * Paper & Ink interactions
 *
 * Vanilla re-implementation of the behaviours specified in the Claude Design
 * mockups: the rotating hero word, cursor-reactive sky parallax and hero tilt,
 * the contents rail's scroll-spy, reading progress, code-block copy buttons,
 * and the mobile nav. Every motion piece is skipped under prefers-reduced-motion.
 */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------------
     Rotating hero word
     --------------------------------------------------------------------------- */

  function initRotator() {
    var host = document.querySelector('[data-rotator]');
    if (!host || reduceMotion) {
      return;
    }

    var words = host.getAttribute('data-rotator').split('|')
      .map(function (word) { return word.trim(); })
      .filter(Boolean);

    var slot = host.querySelector('.hero-word');
    if (!slot || words.length < 2) {
      return;
    }

    var index = 0;

    setInterval(function () {
      index = (index + 1) % words.length;

      // Replacing the node restarts the wordIn animation.
      var next = document.createElement('em');
      next.textContent = words[index];
      slot.replaceChildren(next);
    }, 2800);
  }

  /* ---------------------------------------------------------------------------
     Cursor-reactive sky and hero tilt

     Pointer position is normalised to -1..1 and published as CSS custom
     properties; the transforms themselves live in the stylesheet.
     --------------------------------------------------------------------------- */

  function initPointerParallax() {
    var scenes = document.querySelectorAll('[data-tilt]');
    if (!scenes.length || reduceMotion || !window.matchMedia('(hover: hover)').matches) {
      return;
    }

    scenes.forEach(function (scene) {
      var frame = null;

      function publish(x, y) {
        scene.style.setProperty('--sky-x', x);
        scene.style.setProperty('--sky-y', y);
        scene.style.setProperty('--tilt-x', x);
        scene.style.setProperty('--tilt-y', y);
      }

      scene.addEventListener('pointermove', function (event) {
        var rect = scene.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        var y = ((event.clientY - rect.top) / rect.height) * 2 - 1;

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(function () {
          publish(x.toFixed(3), y.toFixed(3));
        });
      });

      scene.addEventListener('pointerleave', function () {
        cancelAnimationFrame(frame);
        publish(0, 0);
      });
    });
  }

  /* ---------------------------------------------------------------------------
     Contents rail + reading progress
     --------------------------------------------------------------------------- */

  function initReading() {
    var article = document.querySelector('.article');
    var bar = document.querySelector('.reading-progress span');
    var toc = document.querySelector('[data-toc]');

    if (!article) {
      return;
    }

    var percentOut = toc && toc.querySelector('[data-progress-percent]');
    var leftOut = toc && toc.querySelector('[data-progress-left]');
    var progressBox = toc && toc.querySelector('.toc-progress');
    var readTime = progressBox ? parseFloat(progressBox.getAttribute('data-read-time')) || 0 : 0;

    var links = toc ? Array.prototype.slice.call(toc.querySelectorAll('#TableOfContents a')) : [];
    var headings = links
      .map(function (link) {
        var id = decodeURIComponent((link.getAttribute('href') || '').slice(1));
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    // A TOC with no resolvable headings is worse than none at all.
    if (toc && !headings.length) {
      toc.hidden = true;
    }

    var frame = null;

    // offsetTop is offsetParent-relative; these need document coordinates.
    function documentTop(el) {
      return el.getBoundingClientRect().top + window.scrollY;
    }

    function update() {
      frame = null;

      var start = documentTop(article);
      var distance = article.offsetHeight - window.innerHeight;
      var scrolled = window.scrollY - start;
      var ratio = distance > 0 ? scrolled / distance : (window.scrollY > start ? 1 : 0);
      ratio = Math.min(1, Math.max(0, ratio));

      if (bar) {
        bar.style.width = (ratio * 100).toFixed(2) + '%';
      }

      if (percentOut) {
        percentOut.textContent = Math.round(ratio * 100) + '%';
      }

      if (leftOut && readTime) {
        leftOut.textContent = Math.max(0, Math.ceil(readTime * (1 - ratio)));
      }

      if (!headings.length) {
        return;
      }

      // Active section: the last heading whose top has passed the read line,
      // set a little below the header so the current section reads naturally.
      var line = window.scrollY + 200;
      var activeIndex = 0;

      for (var i = 0; i < headings.length; i += 1) {
        if (documentTop(headings[i]) <= line) {
          activeIndex = i;
        } else {
          break;
        }
      }

      links.forEach(function (link, i) {
        link.classList.toggle('active', i === activeIndex);
      });
    }

    function schedule() {
      if (frame === null) {
        frame = requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
  }

  /* ---------------------------------------------------------------------------
     Code blocks — language label and copy button
     --------------------------------------------------------------------------- */

  function initCodeBlocks() {
    var blocks = document.querySelectorAll('.content .highlight, .content > pre');

    blocks.forEach(function (block) {
      var code = block.querySelector('code');
      if (!code || block.querySelector('.code-head')) {
        return;
      }

      var language = (code.className.match(/language-([\w+-]+)/) || [])[1] || 'code';

      var head = document.createElement('div');
      head.className = 'code-head';

      var name = document.createElement('span');
      name.textContent = language;

      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'code-copy';
      button.textContent = 'Copy';

      button.addEventListener('click', function () {
        var text = code.innerText;

        function done(label) {
          button.textContent = label;
          setTimeout(function () { button.textContent = 'Copy'; }, 1600);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            function () { done('Copied'); },
            function () { done('Failed'); }
          );
        } else {
          done('Failed');
        }
      });

      head.appendChild(name);
      head.appendChild(button);
      block.insertBefore(head, block.firstChild);
    });
  }

  /* ---------------------------------------------------------------------------
     Mobile navigation
     --------------------------------------------------------------------------- */

  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.getElementById('nav-links');

    if (!toggle || !links) {
      return;
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('open', !open);
    });
  }

  function init() {
    initNav();
    initRotator();
    initPointerParallax();
    initReading();
    initCodeBlocks();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
