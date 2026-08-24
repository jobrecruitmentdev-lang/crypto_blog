// Omni-Schema Extreme & AEO Post Generator
// Generates 15-20 interconnected Schema types for maximum AI/LLM indexing

function generateAEOPost(airdropData) {
  const { title, slug, summary, definition, steps, faqs, date, expertAuthor, citations, targetKeywords } = airdropData;
  const siteUrl = "https://cryptoairdropai.com";
  const postUrl = `${siteUrl}/blog/${slug}`;

  // --- 1. AEO MARKDOWN GENERATION ---
  let markdown = `> **TL;DR:** ${summary}\n>\n> *Fact-checked by ${expertAuthor.name} (${expertAuthor.role})*\n\n`;
  
  markdown += `## What is ${title}?\n\n`;
  markdown += `${definition}\n\n`;
  
  markdown += `## How to Claim the ${title} Airdrop (Step-by-Step)\n\n`;
  steps.forEach((step, index) => {
    markdown += `${index + 1}. **${step.title}:** ${step.action}\n`;
  });
  markdown += `\n`;

  markdown += `## Frequently Asked Questions\n\n`;
  faqs.forEach(faq => {
    markdown += `**Q: ${faq.question}**\n`;
    markdown += `A: ${faq.answer}\n\n`;
  });

  if (citations && citations.length > 0) {
    markdown += `## Sources & Citations\n\n`;
    citations.forEach(cit => {
      markdown += `- [${cit.title}](${cit.url})\n`;
    });
  }

  // --- 2. 20-TYPE OMNI-SCHEMA (JSON-LD) GENERATION ---
  // We use the @graph approach to tightly interconnect 15-20 schemas.
  
  const omniSchema = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organization
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "Crypto Airdrop AI",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "@id": `${siteUrl}/#logo`,
          "url": `${siteUrl}/logo.png`,
          "caption": "Crypto Airdrop AI Logo"
        },
        "contactPoint": { // 2. ContactPoint
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "hello@cryptoairdropai.com",
          "url": siteUrl
        }
      },
      // 3. WebSite
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Crypto Airdrop AI",
        "publisher": { "@id": `${siteUrl}/#organization` }
      },
      // 4. Person (Author)
      {
        "@type": "Person",
        "@id": `${siteUrl}/#author_${expertAuthor.name.replace(/\s+/g, '')}`,
        "name": expertAuthor.name,
        "jobTitle": expertAuthor.role,
        "url": `${siteUrl}/about`,
        "worksFor": { "@id": `${siteUrl}/#organization` }
      },
      // 5. ImageObject (Cover Image)
      {
        "@type": "ImageObject",
        "@id": `${postUrl}#primaryimage`,
        "url": `${siteUrl}/covers/${slug}.jpg`,
        "description": `Cover image for ${title}`
      },
      // 6. WebPage
      {
        "@type": "WebPage",
        "@id": `${postUrl}#webpage`,
        "url": postUrl,
        "name": title,
        "description": summary,
        "isPartOf": { "@id": `${siteUrl}/#website` },
        "primaryImageOfPage": { "@id": `${postUrl}#primaryimage` },
        "datePublished": date,
        "dateModified": date
      },
      // 7. BreadcrumbList
      {
        "@type": "BreadcrumbList",
        "@id": `${postUrl}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteUrl },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${siteUrl}/blog` },
          { "@type": "ListItem", "position": 3, "name": title, "item": postUrl }
        ]
      },
      // 8. BlogPosting (Core Content)
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        "headline": title,
        "description": summary,
        "datePublished": date,
        "dateModified": date,
        "author": { "@id": `${siteUrl}/#author_${expertAuthor.name.replace(/\s+/g, '')}` },
        "publisher": { "@id": `${siteUrl}/#organization` },
        "mainEntityOfPage": { "@id": `${postUrl}#webpage` },
        "image": { "@id": `${postUrl}#primaryimage` },
        "keywords": targetKeywords.join(", "),
        "citation": citations ? citations.map(c => c.url) : [],
        "hasPart": [ // Connecting other schema types
          { "@id": `${postUrl}#howto` },
          { "@id": `${postUrl}#faq` },
          { "@id": `${postUrl}#event` }
        ]
      },
      // 9. TechArticle (Alternative classification)
      {
        "@type": "TechArticle",
        "@id": `${postUrl}#techarticle`,
        "headline": `Technical details of ${title}`,
        "proficiencyLevel": "Beginner",
        "about": { "@id": `${postUrl}#software` }
      },
      // 10. HowTo (Step-by-step claiming)
      {
        "@type": "HowTo",
        "@id": `${postUrl}#howto`,
        "name": `How to Claim the ${title} Airdrop`,
        "description": `Step by step guide to secure your ${title} allocation.`,
        "step": steps.map((step, index) => ({
          "@type": "HowToStep", // 11. HowToStep
          "position": index + 1,
          "name": step.title,
          "text": step.action
        }))
      },
      // 12. FAQPage
      {
        "@type": "FAQPage",
        "@id": `${postUrl}#faq`,
        "mainEntity": faqs.map(faq => ({
          "@type": "Question", // 13. Question
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer", // 14. Answer
            "text": faq.answer
          }
        }))
      },
      // 15. SoftwareApplication (The DApp or Network being written about)
      {
        "@type": "SoftwareApplication",
        "@id": `${postUrl}#software`,
        "name": title.replace(' Airdrop', ''),
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web3",
        "offers": { "@id": `${postUrl}#offer` }
      },
      // 16. Offer (The Airdrop itself)
      {
        "@type": "Offer",
        "@id": `${postUrl}#offer`,
        "name": `${title} Free Allocation`,
        "price": "0",
        "priceCurrency": "USD",
        "category": "Airdrop"
      },
      // 17. Event (The Token Generation/Snapshot Event)
      {
        "@type": "Event",
        "@id": `${postUrl}#event`,
        "name": `${title} Snapshot or Launch`,
        "description": "Upcoming token distribution event.",
        "startDate": new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0],
        "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled"
      },
      // 18. CreativeWork (General categorization)
      {
        "@type": "CreativeWork",
        "@id": `${postUrl}#creativework`,
        "name": title,
        "author": { "@id": `${siteUrl}/#author_${expertAuthor.name.replace(/\s+/g, '')}` }
      },
      // 19. ItemList (Summary of steps or requirements)
      {
        "@type": "ItemList",
        "@id": `${postUrl}#itemlist`,
        "itemListElement": steps.map((step, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": step.title
        }))
      }
    ]
  };

  markdown += `\n\n<script type="application/ld+json">\n${JSON.stringify(omniSchema, null, 2)}\n</script>\n`;
  return markdown;
}

module.exports = { generateAEOPost };
