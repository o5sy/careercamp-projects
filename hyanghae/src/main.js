
    // ---------- 라우터: #/reviews, #/contact, #/about 등은 별도 페이지, 그 외는 홈(앵커) ----------
    (function () {
      var pages = document.querySelectorAll('[data-page]');
      var navLinks = document.querySelectorAll('.nav a');

      function routeOf(hash) {
        if (hash.indexOf('/reviews') === 0) return 'reviews';
        if (hash.indexOf('/contact') === 0) return 'contact';
        if (hash.indexOf('/diagnosis') === 0) return 'diagnosis';
        if (hash.indexOf('/studio') === 0) return 'studio';
        if (hash.indexOf('/booking') === 0) return 'booking';
        if (hash.indexOf('/products') === 0) return 'products';
        if (hash.indexOf('/about') === 0) return 'about';
        return 'home';
      }

      function render() {
        var hash = location.hash.replace(/^#/, '');
        var route = routeOf(hash);

        pages.forEach(function (p) {
          p.hidden = p.getAttribute('data-page') !== route;
        });

        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('data-nav') === route);
        });

        if (route === 'about') {
          var sub = hash.slice('/about'.length);
          if (sub.indexOf('/') === 0) {
            var aboutEl = document.getElementById('about-' + sub.slice(1));
            if (aboutEl) {
              requestAnimationFrame(function () { aboutEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
              return;
            }
          }
          window.scrollTo(0, 0);
          return;
        }

        if (route === 'home' && hash && hash !== '/' ) {
          var el = document.getElementById(hash);
          if (el) {
            requestAnimationFrame(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
            return;
          }
        }
        window.scrollTo(0, 0);
      }

      window.addEventListener('hashchange', render);
      render();
    })();

    // 홈 — 세 갈래의 여정 카드, 스크롤로 뷰포트에 들어오면 하나씩 떠오르는 효과
    (function () {
      var cards = document.querySelectorAll('.service-card');
      if (!cards.length) return;

      if (!('IntersectionObserver' in window)) {
        cards.forEach(function (card) { card.classList.add('is-visible'); });
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var card = entry.target;
          var index = Array.prototype.indexOf.call(cards, card);
          clearTimeout(card._revealTimer);
          if (entry.isIntersecting) {
            card._revealTimer = setTimeout(function () {
              card.classList.add('is-visible');
            }, index * 140);
          } else {
            card.classList.remove('is-visible');
          }
        });
      }, { threshold: 0.25 });

      cards.forEach(function (card) { observer.observe(card); });
    })();

    // 홈 — 향 진단 3단계, 스크롤로 들어오면 01 → 02 → 03 순서로 진행되는 효과
    (function () {
      var wrap = document.getElementById('processSteps');
      if (!wrap) return;
      var steps = wrap.querySelectorAll('.process__step');
      if (!steps.length) return;

      if (!('IntersectionObserver' in window)) {
        wrap.classList.add('is-progressing');
        steps.forEach(function (step) { step.classList.add('is-visible'); });
        return;
      }

      var STEP_DELAY = 350;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          clearTimeout(wrap._progressTimer);
          steps.forEach(function (step) { clearTimeout(step._revealTimer); });

          if (entry.isIntersecting) {
            steps.forEach(function (step, index) {
              step._revealTimer = setTimeout(function () {
                step.classList.add('is-visible');
              }, index * STEP_DELAY);
            });
            wrap._progressTimer = setTimeout(function () {
              wrap.classList.add('is-progressing');
            }, 60);
          } else {
            wrap.classList.remove('is-progressing');
            steps.forEach(function (step) { step.classList.remove('is-visible'); });
          }
        });
      }, { threshold: 0.35 });

      observer.observe(wrap);
    })();

    // 홈 — 후기 캐러셀 (3개씩 노출, 하나씩 왼쪽으로 무한 순환)
    (function () {
      var track = document.getElementById('reviewsCarousel');
      if (!track) return;

      var originalCount = track.children.length;
      if (!originalCount) return;

      for (var i = 0; i < originalCount; i++) {
        track.appendChild(track.children[i].cloneNode(true));
      }

      var index = 0;
      var timer = null;
      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      function step() {
        var card = track.children[0];
        var gap = 24;
        return card.getBoundingClientRect().width + gap;
      }

      function goTo(nextIndex, animate) {
        track.style.transition = animate ? 'transform 0.7s ease' : 'none';
        track.style.transform = 'translateX(-' + (step() * nextIndex) + 'px)';
      }

      function advance() {
        index++;
        goTo(index, true);
        if (index === originalCount) {
          window.setTimeout(function () {
            index = 0;
            goTo(index, false);
          }, 700);
        }
      }

      function start() {
        if (reduceMotion || timer) return;
        timer = window.setInterval(advance, 4000);
      }
      function stop() {
        window.clearInterval(timer);
        timer = null;
      }

      var carousel = track.closest('.reviews-carousel');
      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);

      window.addEventListener('resize', function () {
        goTo(index, false);
      });

      start();
    })();

    // 네비 토글 (모바일)
    (function () {
      var header = document.querySelector('.header');
      var toggle = document.getElementById('navToggle');
      toggle.addEventListener('click', function () {
        var open = header.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      document.querySelectorAll('.nav a').forEach(function (link) {
        link.addEventListener('click', function () {
          header.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    })();

    // 소개 페이지 오시는 길 — 끌어서 이동 + 확대/축소되는 약도
    (function () {
      var map = document.getElementById('visitMap');
      var viewport = document.getElementById('visitMapViewport');
      var canvas = document.getElementById('visitMapCanvas');
      if (!map || !viewport || !canvas) return;

      var SIZE = 720;
      var FOCUS = { x: 264, y: 440 };
      var view = { x: 0, y: 0, s: 1 };
      var minScale = 1, maxScale = 3;

      function measure() {
        var w = viewport.clientWidth, h = viewport.clientHeight;
        minScale = Math.max(w, h) / SIZE;
        maxScale = minScale * 2.8;
        return { w: w, h: h };
      }

      function clampView() {
        var box = measure();
        view.s = Math.min(maxScale, Math.max(minScale, view.s));
        var span = SIZE * view.s;
        view.x = Math.min(0, Math.max(box.w - span, view.x));
        view.y = Math.min(0, Math.max(box.h - span, view.y));
      }

      function render() {
        clampView();
        canvas.style.transform = 'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.s + ')';
      }

      function centerOn(pt, scale) {
        var box = measure();
        view.s = scale;
        view.x = box.w / 2 - pt.x * scale;
        view.y = box.h / 2 - pt.y * scale;
        render();
      }

      function goHome() { centerOn(FOCUS, minScale * 1.35); }

      function zoomAt(cx, cy, factor) {
        var next = Math.min(maxScale, Math.max(minScale, view.s * factor));
        if (next === view.s) return;
        view.x = cx - (cx - view.x) * (next / view.s);
        view.y = cy - (cy - view.y) * (next / view.s);
        view.s = next;
        render();
      }

      var dragging = false, lastX = 0, lastY = 0, pid = null;

      viewport.addEventListener('pointerdown', function (e) {
        if (e.target.closest('button')) return;
        dragging = true;
        pid = e.pointerId;
        lastX = e.clientX; lastY = e.clientY;
        try { viewport.setPointerCapture(pid); } catch (err) { pid = null; }
        viewport.classList.add('is-dragging');
        canvas.classList.add('is-live');
      });

      viewport.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        view.x += e.clientX - lastX;
        view.y += e.clientY - lastY;
        lastX = e.clientX; lastY = e.clientY;
        render();
      });

      function endDrag() {
        if (!dragging) return;
        dragging = false;
        try {
          if (pid !== null && viewport.hasPointerCapture(pid)) viewport.releasePointerCapture(pid);
        } catch (err) {}
        pid = null;
        viewport.classList.remove('is-dragging');
        canvas.classList.remove('is-live');
      }
      viewport.addEventListener('pointerup', endDrag);
      viewport.addEventListener('pointercancel', endDrag);

      viewport.addEventListener('wheel', function (e) {
        e.preventDefault();
        var rect = viewport.getBoundingClientRect();
        canvas.classList.add('is-live');
        zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY > 0 ? 0.92 : 1.08);
        clearTimeout(viewport._wheelTimer);
        viewport._wheelTimer = setTimeout(function () {
          canvas.classList.remove('is-live');
        }, 140);
      }, { passive: false });

      viewport.addEventListener('keydown', function (e) {
        var step = e.shiftKey ? 120 : 48;
        var box = measure();
        var hit = true;
        switch (e.key) {
          case 'ArrowLeft':  view.x += step; break;
          case 'ArrowRight': view.x -= step; break;
          case 'ArrowUp':    view.y += step; break;
          case 'ArrowDown':  view.y -= step; break;
          case '+': case '=': zoomAt(box.w / 2, box.h / 2, 1.15); break;
          case '-': case '_': zoomAt(box.w / 2, box.h / 2, 0.87); break;
          case '0': goHome(); break;
          default: hit = false;
        }
        if (!hit) return;
        e.preventDefault();
        render();
      });

      map.querySelectorAll('[data-zoom]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var box = measure();
          zoomAt(box.w / 2, box.h / 2, btn.dataset.zoom === 'in' ? 1.3 : 0.77);
        });
      });
      document.getElementById('visitMapHome').addEventListener('click', goHome);

      var btnRoute = document.getElementById('visitMapRoute');
      btnRoute.addEventListener('click', function () {
        var on = btnRoute.getAttribute('aria-pressed') === 'true';
        btnRoute.setAttribute('aria-pressed', String(!on));
        map.classList.toggle('hide-route', on);
      });

      var badge = map.querySelector('.map__badge');
      var badgeText = badge.textContent;
      map.querySelectorAll('.map__marker button').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          badge.textContent = btn.dataset.info;
          clearTimeout(badge._timer);
          badge._timer = setTimeout(function () {
            badge.textContent = badgeText;
          }, 4200);
        });
      });

      window.addEventListener('resize', function () {
        clearTimeout(window._visitMapResize);
        window._visitMapResize = setTimeout(goHome, 160);
      });

      // 소개 페이지로 들어올 때마다 다시 측정 — hidden 상태에선 뷰포트 크기가 0이라 재계산이 필요합니다
      window.addEventListener('hashchange', function () {
        if (location.hash.replace(/^#/, '').indexOf('/about') === 0) {
          setTimeout(goHome, 0);
        }
      });
      if (location.hash.replace(/^#/, '').indexOf('/about') === 0) {
        setTimeout(goHome, 0);
      } else {
        goHome();
      }
    })();

    // 사이트 전체 — 커서를 따라다니는 실선 트레일 효과
    (function () {
      if (window.matchMedia('(hover: none)').matches) return;
      var canvas = document.getElementById('cursorTrail');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      var points = [];
      var MAX_POINTS = 40;
      var raf = null;
      var chaseX = null, chaseY = null;
      var targetX = null, targetY = null;

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      var frameCount = 0;
      function draw() {
        frameCount++;

        if (targetX !== null) {
          if (chaseX === null) { chaseX = targetX; chaseY = targetY; }
          chaseX += (targetX - chaseX) * 0.07;
          chaseY += (targetY - chaseY) * 0.07;
          var dist = Math.hypot(targetX - chaseX, targetY - chaseY);
          if (dist > 0.3) {
            points.push({ x: chaseX, y: chaseY });
            if (points.length > MAX_POINTS) points.shift();
          }
        }

        if (frameCount % 8 === 0 && points.length > 0) points.shift();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (points.length > 1) {
          for (var i = 1; i < points.length; i++) {
            var p0 = points[i - 1];
            var p1 = points[i];
            var t = i / points.length;
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle = 'rgba(156, 107, 67, ' + (t * 0.3) + ')';
            ctx.lineWidth = t * 12;
            ctx.lineCap = 'round';
            ctx.shadowColor = 'rgba(156, 107, 67, 0.5)';
            ctx.shadowBlur = 26;
            ctx.stroke();
          }
        }
        raf = requestAnimationFrame(draw);
      }

      window.addEventListener('mousemove', function (e) {
        targetX = e.clientX;
        targetY = e.clientY;
      });

      document.addEventListener('mouseleave', function () {
        points = [];
      });

      if (!raf) raf = requestAnimationFrame(draw);
    })();

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }

    // 후기 페이지 — localStorage 저장 + 탭 필터 + 작성 폼
    (function () {
      var STORAGE_KEY = 'hyanghae:reviews';
      var LABELS = { diagnosis: '진단', studio: '공방', product: '제품' };
      var grid = document.getElementById('reviewsGrid');
      var tabs = document.querySelectorAll('.tab');
      var empty = document.querySelector('.reviews__empty');
      var form = document.getElementById('review-form');
      var note = document.getElementById('rv-note');

      function getStored() {
        var list;
        try { list = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { list = []; }
        var changed = false;
        list.forEach(function (r) {
          if (!r.id) { r.id = Date.now() + '-' + Math.random().toString(36).slice(2); changed = true; }
        });
        if (changed) setStored(list);
        return list;
      }
      function setStored(list) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {} }
      function removeStored(id) {
        setStored(getStored().filter(function (r) { return r.id !== id; }));
      }
      function todayLabel() {
        var d = new Date(); var m = d.getMonth() + 1;
        return d.getFullYear() + '.' + (m < 10 ? '0' + m : m);
      }
      function buildTile(r, fresh) {
        var art = document.createElement('article');
        art.className = 'review-tile' + (fresh ? ' fresh' : '');
        art.setAttribute('data-category', r.category);
        art.setAttribute('data-id', r.id);
        var label = LABELS[r.category] || '후기';
        art.innerHTML =
          '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">' +
            '<span class="tag">' + label + '</span>' +
            '<button type="button" class="review-tile__delete" aria-label="이 후기 삭제">&times;</button>' +
          '</div>' +
          '<p class="quote">"' + escapeHtml(r.text) + '"</p>' +
          '<div class="meta"><span>' + escapeHtml(r.name) + ' 님</span><span>' + escapeHtml(r.date) + '</span></div>';
        art.querySelector('.review-tile__delete').addEventListener('click', function () {
          removeStored(r.id);
          art.remove();
          applyFilter();
        });
        return art;
      }
      function activeFilter() {
        var el = document.querySelector('.tab.active');
        return el ? el.getAttribute('data-filter') : 'all';
      }
      function applyFilter() {
        if (!grid) return;
        var filter = activeFilter();
        var tiles = grid.querySelectorAll('.review-tile[data-category]');
        var shown = 0;
        tiles.forEach(function (tile) {
          var match = filter === 'all' || tile.getAttribute('data-category') === filter;
          tile.hidden = !match;
          if (match) shown++;
        });
        if (empty) empty.hidden = shown !== 0;
      }

      if (grid) {
        getStored().slice().reverse().forEach(function (r) {
          grid.insertBefore(buildTile(r, false), grid.firstChild);
        });
      }

      tabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) { t.classList.remove('active'); });
          tab.classList.add('active');
          applyFilter();
        });
      });

      if (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (!form.checkValidity()) { form.reportValidity(); return; }
          var review = {
            id: Date.now() + '-' + Math.random().toString(36).slice(2),
            name: form.name.value.trim(),
            category: form.category.value,
            text: form.text.value.trim(),
            date: todayLabel()
          };
          var list = getStored();
          list.push(review);
          setStored(list);
          grid.insertBefore(buildTile(review, true), grid.firstChild);
          form.reset();
          note.classList.add('show');
          applyFilter();
          setTimeout(function () { note.classList.remove('show'); }, 4000);
        });
      }

      applyFilter();
    })();

    // 진단 페이지 — localStorage 저장 + 완료 메시지
    (function () {
      var STORAGE_KEY = 'hyanghae:diagnosis';
      var form = document.getElementById('diagnosis-form');
      var done = document.getElementById('dx-done');
      var again = document.getElementById('dx-again');
      if (!form) return;

      function getStored() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; } }
      function setStored(list) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {} }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        var entry = {
          name: form.elements['name'].value.trim(),
          phone: form.elements['phone'].value.trim(),
          timeSlot: form.elements['timeSlot'].value,
          message: form.elements['message'].value.trim()
        };
        var list = getStored();
        list.push(entry);
        setStored(list);
        form.style.display = 'none';
        done.classList.add('show');
        done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      again.addEventListener('click', function () {
        form.reset();
        done.classList.remove('show');
        form.style.display = 'block';
      });
    })();

    // 공방 예약 페이지 — 프로그램 선택 동기화 + 검증 + 완료 메시지
    (function () {
      var form = document.getElementById('bk-form');
      if (!form) return;
      var done = document.getElementById('bk-done');
      var summary = document.getElementById('bk-summary');
      var dateInput = document.getElementById('bk-date');
      var peopleSelect = document.getElementById('bk-people');
      var peopleNote = document.getElementById('bk-peopleNote');
      var formError = document.getElementById('bk-formError');

      var PROGRAM_LABELS = { consulting: '퍼스널 조향 컨설팅', class: '시그니처 향수 제작 클래스' };
      var CLASS_MIN_PEOPLE = 2;

      function toDateValue(d) {
        return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
      }
      dateInput.min = toDateValue(new Date());

      function selectedProgram() {
        var checked = form.querySelector('input[name="bk-program"]:checked');
        return checked ? checked.value : 'consulting';
      }

      function syncPeople() {
        var isConsulting = selectedProgram() === 'consulting';
        peopleSelect.disabled = isConsulting;
        if (isConsulting) {
          peopleSelect.value = '1';
        } else if (Number(peopleSelect.value) < CLASS_MIN_PEOPLE) {
          peopleSelect.value = String(CLASS_MIN_PEOPLE);
        }
        peopleNote.textContent = isConsulting
          ? '컨설팅은 1:1로만 진행됩니다.'
          : '클래스는 2인 이상부터 예약하실 수 있습니다.';
      }

      // #/booking?program=class 로 프로그램 미리 선택
      function applyPrefillFromHash() {
        var hash = location.hash.replace(/^#/, '');
        if (hash.indexOf('/booking') !== 0) return;
        var qIndex = hash.indexOf('?');
        if (qIndex === -1) return;
        var params = new URLSearchParams(hash.slice(qIndex + 1));
        var program = params.get('program');
        if (program && PROGRAM_LABELS[program]) {
          var target = form.querySelector('input[name="bk-program"][value="' + program + '"]');
          if (target) target.checked = true;
          syncPeople();
        }
      }

      form.querySelectorAll('input[name="bk-program"]').forEach(function (radio) {
        radio.addEventListener('change', syncPeople);
      });
      syncPeople();
      applyPrefillFromHash();
      window.addEventListener('hashchange', applyPrefillFromHash);

      function showError(field, id, msg) {
        var box = document.getElementById(id);
        box.textContent = msg;
        box.hidden = false;
        if (field) field.setAttribute('aria-invalid', 'true');
      }
      function clearError(field, id) {
        var box = document.getElementById(id);
        box.textContent = '';
        box.hidden = true;
        if (field) field.removeAttribute('aria-invalid');
      }

      var CHECKS = [
        ['bk-name', 'bk-nameError'],
        ['bk-phone', 'bk-phoneError'],
        ['bk-date', 'bk-dateError'],
        ['bk-time', 'bk-timeError'],
        ['bk-agree', 'bk-agreeError']
      ];
      CHECKS.forEach(function (pair) {
        var field = document.getElementById(pair[0]);
        var evt = field.type === 'checkbox' ? 'change' : 'input';
        field.addEventListener(evt, function () { clearError(field, pair[1]); });
      });

      function validate() {
        var invalid = [];
        CHECKS.forEach(function (pair) { clearError(document.getElementById(pair[0]), pair[1]); });
        formError.hidden = true;

        function fail(fieldId, msgId, msg) {
          var field = document.getElementById(fieldId);
          showError(field, msgId, msg);
          invalid.push(field);
        }

        var name = document.getElementById('bk-name');
        if (!name.value.trim()) fail('bk-name', 'bk-nameError', '이름을 입력해 주세요.');

        var phone = document.getElementById('bk-phone');
        var digits = phone.value.replace(/\D/g, '');
        if (!digits) fail('bk-phone', 'bk-phoneError', '연락처를 입력해 주세요.');
        else if (digits.length < 9 || digits.length > 11) fail('bk-phone', 'bk-phoneError', '연락처를 다시 확인해 주세요.');

        if (!dateInput.value) {
          fail('bk-date', 'bk-dateError', '희망 날짜를 선택해 주세요.');
        } else {
          var parts = dateInput.value.split('-').map(Number);
          var picked = new Date(parts[0], parts[1] - 1, parts[2]);
          var midnight = new Date();
          midnight.setHours(0, 0, 0, 0);
          if (picked < midnight) fail('bk-date', 'bk-dateError', '오늘 이후의 날짜를 선택해 주세요.');
          else if (picked.getDay() === 1) fail('bk-date', 'bk-dateError', '월요일은 휴무입니다. 다른 날짜를 선택해 주세요.');
        }

        var time = document.getElementById('bk-time');
        if (!time.value) fail('bk-time', 'bk-timeError', '희망 시간을 선택해 주세요.');

        var agree = document.getElementById('bk-agree');
        if (!agree.checked) fail('bk-agree', 'bk-agreeError', '개인정보 수집·이용에 동의해 주세요.');

        return invalid;
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var invalid = validate();
        if (invalid.length) {
          formError.textContent = '입력하지 않은 항목이 있습니다. 확인 후 다시 신청해 주세요.';
          formError.hidden = false;
          invalid[0].focus();
          return;
        }
        var parts = dateInput.value.split('-').map(Number);
        var rows = [
          ['프로그램', PROGRAM_LABELS[selectedProgram()]],
          ['희망 일시', parts[0] + '년 ' + parts[1] + '월 ' + parts[2] + '일 ' + document.getElementById('bk-time').value],
          ['인원', peopleSelect.value + '명'],
          ['연락처', document.getElementById('bk-phone').value.trim()]
        ];
        summary.innerHTML = '';
        rows.forEach(function (row) {
          var dt = document.createElement('dt'); dt.textContent = row[0];
          var dd = document.createElement('dd'); dd.textContent = row[1];
          summary.append(dt, dd);
        });
        form.hidden = true;
        done.hidden = false;
        done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    })();

    // 문의 페이지 — localStorage 저장 + 완료 메시지 + 내 문의 내역
    (function () {
      var STORAGE_KEY = 'hyanghae:inquiries';
      var form = document.getElementById('contact-form');
      var done = document.getElementById('done');
      var again = document.getElementById('again');
      var historyEl = document.getElementById('history');
      var historyEmpty = document.getElementById('history-empty');
      var clearBtn = document.getElementById('clear-history');
      if (!form) return;

      // 제품/공방 페이지의 "문의하기" 링크에서 넘어온 상품 정보 자동 채움
      function applyPrefillFromHash() {
        var hash = location.hash.replace(/^#/, '');
        if (hash.indexOf('/contact') !== 0) return;
        var qIndex = hash.indexOf('?');
        if (qIndex === -1) return;
        var params = new URLSearchParams(hash.slice(qIndex + 1));
        var item = params.get('item');
        var price = params.get('price');
        var type = params.get('type');
        if (type && form.elements['type'] && [].some.call(form.elements['type'].options, function (o) { return o.value === type; })) {
          form.elements['type'].value = type;
        }
        if (item && !form.elements['message'].value) {
          form.elements['message'].value = '[문의 상품] ' + item + (price ? ' (' + price + ')' : '');
        }
      }
      window.addEventListener('hashchange', applyPrefillFromHash);
      applyPrefillFromHash();

      function getStored() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; } }
      function setStored(list) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {} }
      function dateLabel() {
        var d = new Date(); var m = d.getMonth() + 1, day = d.getDate();
        return d.getFullYear() + '.' + (m < 10 ? '0' + m : m) + '.' + (day < 10 ? '0' + day : day);
      }
      function summarize(text) {
        var t = text.replace(/\s+/g, ' ').trim();
        return t.length > 42 ? t.slice(0, 42) + '…' : t;
      }
      var CHEV = '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';

      function renderHistory() {
        var list = getStored();
        historyEl.innerHTML = '';
        if (!list.length) { historyEmpty.hidden = false; clearBtn.hidden = true; return; }
        historyEmpty.hidden = true;
        clearBtn.hidden = false;
        list.slice().reverse().forEach(function (item) {
          var d = document.createElement('details');
          d.className = 'acc';
          d.innerHTML =
            '<summary>' +
              '<span class="title">' + escapeHtml(summarize(item.message)) + '</span>' +
              '<span class="badge-status">답변 대기</span>' + CHEV +
            '</summary>' +
            '<div class="body">' +
              '<div class="meta-row"><span class="badge-type">' + escapeHtml(item.type) + '</span><span>' + escapeHtml(item.date) + '</span></div>' +
              '<p style="margin:12px 0 0;">' + escapeHtml(item.message) + '</p>' +
              '<span class="ans-label" style="margin-top:16px;">답변 안내</span>' +
              '<p style="margin:0;">확인 후 남겨주신 연락처로 답변드리겠습니다. 문의해 주셔서 감사합니다.</p>' +
            '</div>';
          historyEl.appendChild(d);
        });
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        var inquiry = {
          type: form.elements['type'].value,
          name: form.elements['name'].value.trim(),
          contact: form.elements['contact'].value.trim(),
          message: form.elements['message'].value.trim(),
          date: dateLabel()
        };
        var list = getStored();
        list.push(inquiry);
        setStored(list);
        renderHistory();
        form.style.display = 'none';
        done.classList.add('show');
        done.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });

      again.addEventListener('click', function () {
        form.reset();
        done.classList.remove('show');
        form.style.display = 'block';
      });

      clearBtn.addEventListener('click', function () {
        if (!window.confirm('문의 내역을 모두 지울까요?')) return;
        setStored([]);
        renderHistory();
      });

      renderHistory();
    })();
  