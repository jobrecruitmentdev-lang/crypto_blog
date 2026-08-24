import unittest
import sys
import os

# Add automation directory to path
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(__file__)), "automation"))

from modules.content_validator import validate_content_payload
from modules.claim_verifier import verify_claims_and_urls
from modules.internal_linker import inject_internal_links

class TestValidatorAndLinker(unittest.TestCase):

    def test_internal_linker_word_boundary_and_exclusions(self):
        # Monad should match Monad, but not Monadic
        # Should not link inside existing <a>, <h1>-<h6>, <code>
        html_input = """
        <h2>Overview of Monad Protocol</h2>
        <p>The Monad network features high throughput. However, monadic operations in functional programming are distinct.</p>
        <p>Check out <a href="https://monad.xyz">Monad Official Portal</a> for details.</p>
        <pre><code>monad.run()</code></pre>
        <p>Also explore Privacy Pools for zero-knowledge compliance.</p>
        """
        
        linked_html, linked_entities = inject_internal_links(html_input)
        
        # Verify Privacy Pools was linked
        self.assertIn('<a href="/projects/privacy-pools/">Privacy Pools</a>', linked_html)
        
        # Verify Monad inside paragraph was linked
        self.assertIn('<a href="/projects/monad/">Monad</a>', linked_html)
        
        # Verify 'monadic' was NOT replaced/linked
        self.assertIn("monadic operations", linked_html)
        self.assertNotIn('<a href="/projects/monad/">monadic</a>', linked_html)
        
        # Verify <h2> was NOT replaced/linked
        self.assertIn("<h2>Overview of Monad Protocol</h2>", linked_html)

    def test_content_validator_rejects_ungrounded_evm_addresses(self):
        payload = {
            "title": "Monad Ecosystem Airdrop Playbook & Farming Strategy 2026",
            "slug": "monad-ecosystem-airdrop-playbook-2026",
            "html": "<p>Send funds to 0x1234567890123456789012345678901234567890 for token distribution.</p><h2>Security Checklist</h2><p>Always maintain anti-sybil safety and protect your wallet.</p>",
            "seo": {
                "tldr": "A comprehensive guide on qualifying for the Monad ecosystem airdrop in 2026 with full step-by-step testnet tasks and anti-sybil protection measures.",
                "faqs": [
                    {"q": "What is Monad?", "a": "Monad is an ultra-high performance EVM-compatible Layer 1 blockchain."},
                    {"q": "How to qualify?", "a": "Interact with verified testnet dApps and provide liquidity."},
                    {"q": "When is the snapshot?", "a": "The snapshot date is expected in Q3 2026."}
                ],
                "key_takeaways": [
                    "Perform testnet transactions weekly",
                    "Maintain distinct wallet funding paths",
                    "Engage with top ecosystem dApps",
                    "Monitor official announcement channels"
                ]
            },
            "author_slug": "ai-intelligence-engine"
        }
        
        # Without grounding payload containing the address -> should fail
        is_valid, errors = validate_content_payload(payload, verified_grounding={"contract_addresses": []})
        self.assertFalse(is_valid)
        self.assertTrue(any("Ungrounded EVM contract address" in err for err in errors))

    def test_claim_verifier_rejects_unverified_domains(self):
        html_content = '<p>Visit <a href="https://malicious-phishing-site.xyz/claim">Phishing Claim</a></p>'
        grounding = {"verified_urls": ["https://coingecko.com/en/coins/monad"]}
        
        is_valid, errors = verify_claims_and_urls(html_content, grounding)
        self.assertFalse(is_valid)
        self.assertTrue(any("Ungrounded external domain" in err for err in errors))

if __name__ == "__main__":
    unittest.main()
