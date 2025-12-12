// Wait until libraries are loaded
    window.addEventListener('load', () => {
      const stage = document.getElementById('stage');
      const bookEl = document.getElementById('book');
      const placeholder = document.getElementById('placeholder');
      const progressBar = document.getElementById('progress');
      const stats = document.getElementById('stats');
      const nav = document.getElementById('nav');
      const pageLabel = document.getElementById('pageLabel');
      const pdfUrlInput = document.getElementById('pdfUrl');

      const loadUrlBtn = document.getElementById('loadUrlBtn');
      const fileInput = document.getElementById('pdfFile');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const fsBtn = document.getElementById('fsBtn');

      // Configure PDF.js worker
      if (window['pdfjsLib']) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
      }

      let pageFlip = null;
      let totalPages = 0;

      function setLoading(pct, text = '') {
        progressBar.style.width = (pct * 100).toFixed(1) + '%';
        stats.textContent = text;
      }

      function showBookUI(show) {
        bookEl.classList.toggle('hidden', !show);
        nav.classList.toggle('hidden', !show);
        placeholder.classList.toggle('hidden', show);
      }

      function updatePageLabel() {
        if (!pageFlip) return;
        const state = pageFlip.getState(); // {page, pages, ...}
        pageLabel.textContent = `${state.page + 1} / ${state.pages}`;
      }

      // Render a PDF to array of data-URLs (images)
      async function pdfToImages(pdfData) {
        const pdf = await pdfjsLib.getDocument(pdfData).promise;
        const images = [];
        totalPages = pdf.numPages;

        // Target width for quality; auto height by scale
        const targetWidth = Math.min(stage.clientWidth * 0.95, 1400);

        for (let i = 1; i <= pdf.numPages; i++) {
          setLoading(i / (pdf.numPages + 1), `Rendering page ${i} of ${pdf.numPages}…`);
          const page = await pdf.getPage(i);

          const viewport = page.getViewport({ scale: 1.0 });
          const scale = targetWidth / viewport.width;
          const scaledViewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: false });
          canvas.width = Math.floor(scaledViewport.width);
          canvas.height = Math.floor(scaledViewport.height);

          await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;
          images.push(canvas.toDataURL('image/jpeg', 0.9));
        }
        setLoading(1, 'Preparing flipbook…');
        return images;
      }

      // Initialize / reload the PageFlip with given images
      function initFlipbook(imageUrls) {
        // Reset previous instance
        if (pageFlip) {
          pageFlip.destroy();
          pageFlip = null;
        }

        showBookUI(true);

        // Create PageFlip
        pageFlip = new St.PageFlip(bookEl, {
          width: Math.min(800, stage.clientWidth * 0.48),  // single page width
          height: Math.min(1100, stage.clientHeight * 0.9),
          size: 'stretch',          // responsive
          minWidth: 320,
          maxWidth: 2000,
          minHeight: 420,
          maxHeight: 2500,
          drawShadow: true,
          flippingTime: 600,
          showCover: true,
          usePortrait: true,
          mobileScrollSupport: true,
          startZIndex: 2
        });

        // PageFlip can load from image URLs (data URLs work)
        pageFlip.loadFromImages(imageUrls);

        pageFlip.on('flip', updatePageLabel);
        pageFlip.on('changeState', updatePageLabel);

        updatePageLabel();
        setLoading(1, `Loaded ${imageUrls.length} page(s).`);
        // Small delay to clear progress bar
        setTimeout(() => setLoading(0, ''), 600);
      }

      // Read a File object into ArrayBuffer
      function fileToArrayBuffer(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(new Uint8Array(reader.result));
          reader.onerror = reject;
          reader.readAsArrayBuffer(file);
        });
      }

      // Load from local file
      fileInput.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
          setLoading(0.05, `Reading ${file.name}…`);
          const data = await fileToArrayBuffer(file);
          const images = await pdfToImages({ data });
          initFlipbook(images);
        } catch (err) {
          console.error(err);
          alert('Failed to open this PDF. See console for details.');
          setLoading(0, '');
        }
      });

      // Load from URL
      loadUrlBtn.addEventListener('click', async () => {
        const url = pdfUrlInput.value.trim();
        if (!url) {
          alert('Please paste a direct link to a PDF first.');
          return;
        }
        try {
          setLoading(0.05, 'Fetching PDF…');
          // PDF.js can fetch by URL (CORS must be allowed by the server)
          const images = await pdfToImages({ url });
          initFlipbook(images);
        } catch (err) {
          console.error(err);
          alert('Failed to load PDF from URL (CORS blocked or invalid). Try downloading the PDF and using "Choose PDF…".');
          setLoading(0, '');
        }
      });
      
    });function showCategory(categoryId) {
      document.querySelectorAll('.products').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById(categoryId).classList.add('active');
      event.target.classList.add('active');
      document.getElementById('details').style.display = 'none';
    }

    function showDetails(name, img, desc, tech, usage, pack) {
      const details = `
        <h3>${name}</h3>
        <img src="${img}" alt="${name}">
        <p><strong>Description:</strong> ${desc}</p>
        <p><strong>Technical Name:</strong> ${tech}</p>
        <p><strong>Usage:</strong> ${usage}</p>
        <p><strong>Package:</strong> ${pack}</p>
      `;
      const detailBox = document.getElementById('details');
      detailBox.innerHTML = details;
      detailBox.style.display = 'block';
      detailBox.scrollIntoView({ behavior: "smooth" });
    }
        // Show the button when scrolling down
    const backToTopButton = document.getElementById('backToTop');
    window.onscroll = function () {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    };

    // Smooth scroll to top
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
// Form submission handling
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if(name && email && message) {
                // In a real application, you would send this data to a server
                alert(`Thank you, ${name}! Your message has been sent successfully. We'll get back to you at ${email} soon.`);
                
                // Reset the form
                document.getElementById('contactForm').reset();
            } else {
                alert('Please fill in all fields before submitting.');
            }
        });
        
        // Simple animation for news cards when they come into view
       


        const scrollToTopBtn = document.getElementById("scrollToTopBtn");

//Get the button
    var mybutton = document.getElementById("topBtn");

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }

    // When the user clicks on the button, scroll to the top of the document
    function topFunction() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    // --- Nav polishing: smooth scroll, active link highlighting, mobile toggle ---
    (function() {
      // Add nav-cta class to existing contact button in nav (if present)
      var navBtn = document.querySelector('.nav-container .btn');
      if (navBtn) navBtn.classList.add('nav-cta');

      var navLinksContainer = document.getElementById('navLinks');
      var menuToggle = document.getElementById('menuToggle');
      var navLinks = document.querySelectorAll('.nav-links a');

      // Mobile toggle (safe even if inline toggle exists)
      if (menuToggle && navLinksContainer) {
        // ensure aria attributes
        menuToggle.setAttribute('role','button');
        menuToggle.setAttribute('aria-controls','navLinks');
        menuToggle.setAttribute('aria-expanded','false');

        menuToggle.addEventListener('click', function(e) {
          var opened = navLinksContainer.classList.toggle('active');
          menuToggle.classList.toggle('open', opened);
          menuToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
          document.body.classList.toggle('nav-open', opened);
        });
      }

      // Smooth scroll for anchor links
      navLinks.forEach(function(a) {
        var href = a.getAttribute('href') || '';
        if (href.indexOf('#') === 0) {
          a.addEventListener('click', function(ev) {
            ev.preventDefault();
            var id = href.slice(1);
            var target = document.getElementById(id);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              // close mobile menu after click
              if (navLinksContainer && navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                // also reset toggle button and body lock
                if (menuToggle) {
                  menuToggle.classList.remove('open');
                  menuToggle.setAttribute('aria-expanded','false');
                }
                document.body.classList.remove('nav-open');
              }
            } else {
              // fallback to location change
              window.location.hash = href;
            }
          });
        }
      });

      // Highlight nav link for visible section
      function updateActiveNav() {
        var fromTop = window.scrollY + 80; // offset for sticky nav
        navLinks.forEach(function(link) {
          var href = link.getAttribute('href');
          if (!href || href.charAt(0) !== '#') return;
          var section = document.getElementById(href.slice(1));
          if (!section) return;
          var top = section.offsetTop;
          var bottom = top + section.offsetHeight;
          if (fromTop >= top && fromTop < bottom) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }

      window.addEventListener('scroll', updateActiveNav, { passive: true });
      // initial
      setTimeout(updateActiveNav, 300);
    })();

    // Dropdown toggle behavior: open/close on click (mobile) and keyboard accessible
    (function() {
      document.addEventListener('click', function(e) {
        // Close any open dropdown if clicking outside
        var open = document.querySelectorAll('.nav-links .dropdown.open');
        if (open.length && !e.target.closest('.nav-links .dropdown')) {
          open.forEach(function(li){ li.classList.remove('open'); li.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded','false'); });
        }
      });

      // Toggle handler for dropdown buttons
      var toggles = document.querySelectorAll('.dropdown-toggle');
      toggles.forEach(function(btn) {
        btn.addEventListener('click', function(ev) {
          ev.preventDefault();
          var li = btn.closest('.dropdown');
          var isOpen = li.classList.toggle('open');
          btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // keyboard access: Enter/Space toggles, Esc closes
        btn.addEventListener('keydown', function(ev) {
          if (ev.key === 'Enter' || ev.key === ' ') {
            ev.preventDefault();
            btn.click();
          } else if (ev.key === 'Escape') {
            var li = btn.closest('.dropdown');
            li.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            btn.focus();
          }
        });
      });

      // Close dropdowns with Escape anywhere
      document.addEventListener('keydown', function(ev) {
        if (ev.key === 'Escape') {
          document.querySelectorAll('.nav-links .dropdown.open').forEach(function(li){ li.classList.remove('open'); li.querySelector('.dropdown-toggle')?.setAttribute('aria-expanded','false'); });
        }
      });
    })();

    // Safety fallback: ensure hamburger toggles the mobile nav even if earlier handler didn't bind
    document.addEventListener('DOMContentLoaded', function () {
      try {
        var menuToggleFB = document.getElementById('menuToggle');
        var navLinksFB = document.getElementById('navLinks');
        if (menuToggleFB && navLinksFB) {
          menuToggleFB.addEventListener('click', function (e) {
            var opened = navLinksFB.classList.toggle('active');
            menuToggleFB.classList.toggle('open', opened);
            menuToggleFB.setAttribute('aria-expanded', opened ? 'true' : 'false');
            document.body.classList.toggle('nav-open', opened);
          });
        }
      } catch (err) {
        // non-fatal
        console && console.warn && console.warn('menu fallback failed', err);
      }
    });