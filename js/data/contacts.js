// contacts.js - Social and professional networking data
const contacts = {
    arch: {
        left: {
            linkedin: {
                url: "https://www.linkedin.com/in/daniel-izmailov-clauzel-547636179/",
                icon: "📎",
                name: {
                    fr: "LinkedIn",
                    en: "LinkedIn",
                    ru: "LinkedIn"
                },
                position: "left"
            }
        },
        center: {
            github: {
                url: "https://github.com/TeaHawk",
                icon: "💻",
                name: {
                    fr: "GitHub",
                    en: "GitHub",
                    ru: "GitHub"
                },
                position: "center"
            }
        },
        right: {
            email: {
                icon: "✉️",
                url: function(lang) {
                    // Get email without emoji
                    const headerContact = translations[lang].header.contact;
                    const email = headerContact.email.split(' ')[1];
                    return `mailto:${email}`;
                },
                name: {
                    fr: "Email",
                    en: "Email",
                    ru: "Email"
                },
                text: function(lang) {
                    return translations[lang].header.contact.email;
                },
                position: "right"
            }
        },
        bottom: {
            phone: {
                icon: "📱",
                url: function(lang) {
                    // Get phone without emoji
                    const headerContact = translations[lang].header.contact;
                    const phone = headerContact.phone.split(' ')[1];
                    return `tel:${phone.replace(/\s/g, '')}`;
                },
                name: {
                    fr: "Téléphone",
                    en: "Phone",
                    ru: "Телефон"
                },
                text: function(lang) {
                    return translations[lang].header.contact.phone;
                },
                position: "bottom"
            }
        }
    }
};
