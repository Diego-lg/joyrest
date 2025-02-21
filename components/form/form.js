document.addEventListener("DOMContentLoaded", function () {
  const contactFormHTML = `
      <section id="contact-form" class="section">
        <div class="section-header">
          <h2>Contact Us</h2>
          <p>We'd love to hear from you! Send us a message.</p>
        </div>
        <div class="form-container">
          <form id="contactForm" action="#" method="POST">
            <div class="form-group">
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" placeholder="Your name" required />
            </div>
            <div class="form-group">
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" placeholder="Your email" required />
            </div>
            <div class="form-group">
              <label for="subject">Subject:</label>
              <input type="text" id="subject" name="subject" placeholder="Subject" required />
            </div>
            <div class="form-group">
              <label for="message">Message:</label>
              <textarea id="message" name="message" placeholder="Your message" rows="5" required></textarea>
            </div>
            <div class="form-group">
              <input type="checkbox" id="gdpr" name="gdpr" required />
              <label for="gdpr">
                I agree to the
                <a href="/privacy-policy" target="_blank">privacy policy</a>
              </label>
            </div>
            <div class="form-group">
              <button type="submit" class="button">Send Message</button>
            </div>
          </form>
        </div>
      </section>
    `;

  document.getElementById("contact-section").innerHTML = contactFormHTML;

  document
    .getElementById("contactForm")
    .addEventListener("submit", function (event) {
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const subject = document.getElementById("subject").value.trim();
      const message = document.getElementById("message").value.trim();
      const gdpr = document.getElementById("gdpr").checked;

      if (!name || !email || !subject || !message || !gdpr) {
        alert("Please fill out all fields and agree to the privacy policy.");
        event.preventDefault();
      } else if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        event.preventDefault();
      }
    });
});

// validation function
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

const contactFormCSS = `
  /* Contact Form Styles */
  #contact-form {
      background-color: #f9f9f9;
   }

  .form-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 0 20px;
  }

  .form-group {
      margin-bottom: 20px;
  }

  .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 5px;
      color: #333;
  }

  .form-group input[type="text"],
  .form-group input[type="email"],
  .form-group textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-family: 'Poppins', sans-serif;
      font-size: 1em;
      transition: border-color 0.3s ease;
  }

  .form-group input[type="text"]:focus,
  .form-group input[type="email"]:focus,
  .form-group textarea:focus {
      border-color: #d4af37;
      outline: none;
  }

  .form-group textarea {
      resize: vertical;
  }

  .form-group input[type="checkbox"] {
      margin-right: 10px;
  }

 

 

   
  .form-group a {
      color: #d4af37;
      text-decoration: none;
      transition: color 0.3s ease;
  }

  .form-group a:hover {
      color: #c0941a;
  }
`;

const styleElement = document.createElement("style");
styleElement.textContent = contactFormCSS;

document.head.appendChild(styleElement);
