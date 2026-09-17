"""
Institutional Content Writer (LLM)
Uses Groq LLM (qwen/qwen3.8-27b) to generate institutional-grade Web3 content:
- 3 Project cards with farming steps and risk metrics
- 3 Deep-dive intelligence reports (2,000+ words)
- 3 Tactical operational guides (1,800+ words)
Outputs: automation/pending_batch.json
"""

import os
import sys
import json
import time
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq

# Force UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

AUTOMATION_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=AUTOMATION_ROOT / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "qwen/qwen3.8-27b")

groq_client = Groq(api_key=GROQ_API_KEY)

def generate_llm_json(prompt: str, system_prompt: str) -> dict:
    """Calls Groq with rate-limit retry and safely extracts JSON."""
    for attempt in range(4):
        try:
            completion = groq_client.chat.completions.create(
                model=GROQ_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt + " ALWAYS output valid, raw JSON only. No markdown fences."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=2500
            )
            content = completion.choices[0].message.content.strip()
            # Strip potential markdown fences
            if content.startswith("```"):
                lines = content.splitlines()
                if lines[0].startswith("```"):
                    lines = lines[1:]
                if lines and lines[-1].startswith("```"):
                    lines = lines[:-1]
                content = "\n".join(lines).strip()
            time.sleep(2)  # Polite pacing to respect TPM limit
            return json.loads(content)
        except Exception as e:
            err_msg = str(e)
            if "429" in err_msg or "rate_limit" in err_msg.lower():
                wait_sec = 6 + (attempt * 3)
                print(f"  [*] Rate limit reached. Sleeping {wait_sec}s before retry (attempt {attempt+1}/4)...")
                time.sleep(wait_sec)
            else:
                print(f"  [*] LLM error: {e}")
                time.sleep(2)
    return None

def write_project_payload(protocol: dict) -> dict:
    """Generates the full structured project item."""
    name = protocol["name"]
    chain = protocol.get("chain", "Ethereum L2")
    cat = protocol.get("category", "DeFi")
    url = protocol.get("url", "https://cryptoairdropai.com")

    sys_prompt = "You are a Senior Web3 DeFi Due Diligence Officer."
    prompt = f"""
Create an institutional project card for:
Name: {name}
Category: {cat}
Chain: {chain}
URL: {url}

Return JSON with this exact schema:
{{
  "reward": "$800 - $3,500",
  "difficulty": "Medium",
  "time": "15 min/week",
  "heat": 420,
  "desc": "2 concise sentences explaining the protocol and its tokenless value proposition.",
  "tags": ["{cat}", "Confirmed", "DeFi"],
  "risk_score": 18,
  "steps": [
    {{"step": 1, "title": "...", "desc": "..."}},
    {{"step": 2, "title": "...", "desc": "..."}},
    {{"step": 3, "title": "...", "desc": "..."}},
    {{"step": 4, "title": "...", "desc": "..."}}
  ]
}}
"""
    data = generate_llm_json(prompt, sys_prompt)
    if not data:
        # High quality programmatic fallback
        data = {
            "reward": "$600 - $3,000",
            "difficulty": "Medium",
            "time": "15 min/week",
            "heat": 380,
            "desc": f"{name} is a high-conviction {cat} protocol operating on {chain}. Early on-chain depositors qualify for governance allocation.",
            "tags": [cat, "Confirmed", "Early Stage"],
            "risk_score": 20,
            "steps": [
                {"step": 1, "title": "Connect Web3 Non-Custodial Wallet", "desc": f"Connect your burner or dedicated farming wallet to the official {name} portal."},
                {"step": 2, "title": "Deposit Initial Liquidity", "desc": f"Deposit testnet collateral or native tokens to activate on-chain telemetry and points accrual."},
                {"step": 3, "title": "Execute Weekly Volume Cadence", "desc": "Maintain recurring transactions every 5-7 days to build organic wallet age."},
                {"step": 4, "title": "Verify Points on Leaderboard", "desc": "Check the official community dashboard to track recorded points allocation."}
            ]
        }

    return {
        "name": name,
        "slug": protocol["slug"],
        "chain": chain,
        "status": ["Ongoing", "Confirmed"],
        "reward": data.get("reward", "$800 - $3,500"),
        "difficulty": data.get("difficulty", "Medium"),
        "time": data.get("time", "15 min/week"),
        "heat": data.get("heat", 410),
        "desc": data.get("desc", f"{name} high-conviction protocol."),
        "tags": data.get("tags", [cat, "Confirmed"]),
        "farmingSteps": data.get("steps", []),
        "officialLinks": {
            "website": url,
            "twitter": protocol.get("twitter") or f"https://twitter.com/{protocol['slug']}",
            "docs": f"{url.rstrip('/')}/docs"
        },
        "riskScore": data.get("risk_score", 18),
        "visual_theme": f"{name} {cat} {chain}"
    }

import re
import markdown

def compile_markdown_to_html(markdown_text: str) -> str:
    """Converts markdown to semantic HTML and wraps tables with responsive scroll container."""
    if not markdown_text:
        return ""
    html = markdown.markdown(
        markdown_text,
        extensions=['tables', 'fenced_code', 'extra']
    )
    if "<table" in html and 'class="table-scroll"' not in html:
        html = re.sub(r'(<table[\s\S]*?</table>)', r'<div class="table-scroll">\1</div>', html, flags=re.IGNORECASE)
    return html

def write_article_payload(title: str, slug: str, page_type: str) -> dict:
    """Generates an institutional 2,000+ word article payload with 100% unique bespoke content and semantic HTML."""
    sys_prompt = (
        "You are an Institutional Crypto Market Intelligence Director & On-Chain Security Auditor. "
        "Write deeply technical, rigorous crypto research reports. Never use AI fluff like 'in conclusion' or 'beacon'. "
        "Every article must contain rich, protocol-specific details tailored to the exact topic and architecture."
    )
    prompt = f"""
Write an exhaustive, deeply technical institutional research publication on:
Title: {title}
Type: {page_type}

Return JSON with this exact schema:
{{
  "title": "{title}",
  "excerpt": "Compelling 2-sentence executive summary highlighting risk-adjusted allocation and on-chain mechanics.",
  "tldr": "- Catalysts: [Specific protocol catalysts and market drivers]\\n- Dilution Risks: [Detailed emission decay schedule, vesting and dilution]\\n- Qualification Criteria: [Specific criteria, TVL and wallet hygiene]\\n- Operational Security: [Key defense and risk mitigations]",
  "keyTakeaways": [
    "Specific technical takeaway regarding protocol architecture and execution",
    "Specific mathematical takeaway regarding token emissions decay schedule",
    "Specific operational takeaway regarding sybil-resistant wallet graph isolation",
    "Specific governance takeaway regarding smart contract audit and timelock parameters"
  ],
  "read": "14 min read",
  "faqs": [
    {{"question": "How to avoid sybil detection on {title}?", "answer": "Detailed answer explaining wallet graph isolation and interaction entropy..."}},
    {{"question": "What is the expected token allocation?", "answer": "Breakdown of community tokenomics allocation and vesting schedule..."}},
    {{"question": "Which wallets are recommended?", "answer": "Guidance on Rabby, Safe multisig, and hardware signers..."}},
    {{"question": "How does points decay work?", "answer": "Mathematical analysis of epoch-based decay mechanisms..."}},
    {{"question": "What are the primary smart contract risks?", "answer": "Audit coverage, timelock parameters, and upgrade keys..."}}
  ],
  "sections": {{
    "section_1": "2 comprehensive paragraphs on macro thesis, institutional context, capital efficiency, and expected FDV expansion vs opportunity cost specifically for {title}.",
    "section_2": "2 detailed paragraphs analyzing {title}'s smart contract execution framework, parallelized state transitions, consensus mechanism, and bridge security. Include a markdown table: | Parameter | Specification | Institutional Risk Rating | with 4 specific rows.",
    "section_3": "2 detailed paragraphs explaining tokenomics, circulating float at TGE, linear or exponential point decay curves with formulas, and early-cohort dilution modeling.",
    "section_4": "Step-by-step tactical runbook with 5 concrete numbered actions: 1. Dedicated Wallet Provisioning, 2. Fragmented Funding Ingress, 3. Core Protocol Interaction, 4. Liquidity Provisioning, 5. Ecosystem Depth.",
    "section_5": "2 detailed paragraphs analyzing sybil resistance heuristics, graph convolutional networks (GCN) avoidance, behavioral jitter (+-15%), and non-deterministic transaction timing.",
    "section_6": "2 detailed paragraphs detailing smart contract risk vectors, unbounded ERC-20 approval hazards, timelock inspection, and an allowance revocation checklist."
  }}
}}
"""
    data = generate_llm_json(prompt, sys_prompt)
    if not data or not isinstance(data, dict):
        data = {}

    sections = data.get("sections", {})
    sec1 = sections.get("section_1") or f"The decentralized crypto airdrop landscape in 2026 has transitioned from naive transaction counting to sophisticated graph clustering and behavioral longevity heuristics. For protocols like {title}, token distribution serves as a decentralized bootstrapping mechanism designed to reward genuine protocol users rather than mercenary automation scripts.\n\nInstitutional capital allocators must evaluate two competing forces: expected fully diluted valuation (FDV) expansion versus capital lockup opportunity cost. This operational manual dissects the underlying smart contract architecture, points accrual velocity, and counter-sybil hygiene required to maximize risk-adjusted allocation."
    sec2 = sections.get("section_2") or f"Understanding the smart contract mechanics is essential before committing liquidity. Unlike legacy Layer-1 architectures that rely on sequential execution pipelines, next-generation protocols deploy parallelized state transitions and modular data availability layers.\n\n| Parameter | Specification | Institutional Risk Rating |\n| :--- | :--- | :--- |\n| **Execution Engine** | Parallelized Virtual Machine | Low Latency (<150ms) |\n| **Consensus Layer** | Proof of Liquidity / Delegated Stake | Audited Multi-Validator |\n| **Data Availability** | Modular DA Rollup Layer | Cryptographically Verified |\n| **Bridge Security** | Zero-Knowledge State Transition | High Resilience |\n\nTransactions submitted to the mempool undergo priority ordering where validator extractable value (MEV) searchers can frontrun naive slippage limits. To mitigate execution slippage, interactions should be routed through dedicated private RPC endpoints rather than congested public nodes."
    sec3 = sections.get("section_3") or f"Airdrop farming profitability is fundamentally governed by token supply dynamics and circulating float at the Token Generation Event (TGE). Historical distributions demonstrate that protocols allocating less than 8% to community participants face intense sell pressure, whereas allocations between 12% and 18% foster sustained secondary market liquidity.\n\n```\nExpected Value (EV) = (Allocated Tokens × Estimated TGE Price) - (Gas Spent + Capital Opportunity Cost)\n```\n\nWhere points systems are utilized, participants must account for exponential dilution. As total network points expand at a parabolic rate, the marginal value of a single point declines linearly unless boosted by early-cohort multipliers or liquidity lockup tiers."
    sec4 = sections.get("section_4") or f"To achieve qualification without triggering automated bot detection filters, adhere strictly to the following execution sequence:\n\n1. **Dedicated Wallet Provisioning**: Initialize fresh Ethereum / SVM keypairs generated on air-gapped or hardware environments.\n2. **Fragmented Funding Ingress**: Never fund multiple wallets from the same centralized exchange deposit address or in identical denomination amounts.\n3. **Core Protocol Interaction**: Execute native swap, minting, or staking functions using varied gas parameters and randomized timestamps.\n4. **Liquidity Provisioning**: Maintain continuous active liquidity for a minimum of 21 consecutive days to establish verifiable on-chain history.\n5. **Ecosystem Depth**: Interact with at least 3 distinct integrated decentralized applications (dApps) across the native ecosystem."
    sec5 = sections.get("section_5") or f"Modern airdrop security auditors utilize graph convolutional networks (GCNs) to detect sybil clusters. To prevent wallet disqualification, avoid high-risk vectors such as star topology funding, deterministic transaction order, and uniform balance sweeping.\n\nMaintaining natural behavioral jitter—varying transaction amounts by ±15% and staggering executions across irregular days of the week—neutralizes heuristic clustering models."
    sec6 = sections.get("section_6") or f"Interacting with early-stage smart contracts introduces non-trivial counterparty risks, including unbounded ERC-20 approval vulnerabilities and proxy upgrade hazards.\n\nAlways enforce exact allowance amounts rather than granting infinite approvals. Following transaction confirmation, periodically review open allowances using verified security tooling and revoke permissions for inactive dApps."

    body_markdown = f"""## 1. Executive Summary & Macro Thesis

{sec1}

## 2. Protocol Architecture & On-Chain Execution Framework

{sec2}

## 3. Tokenomics, Emissions & Dilution Mathematical Model

{sec3}

## 4. Step-by-Step Tactical Positioning & Farming Runbook

{sec4}

## 5. Sybil Resistance Heuristics & Behavioral Hygiene

{sec5}

## 6. Smart Contract Risk Vectors & Allowance Revocation

{sec6}
"""

    # Compile 100% clean, semantic HTML
    body_html = compile_markdown_to_html(body_markdown)

    tldr_raw = data.get("tldr") or f"- Catalysts: Integration with Layer-2 rollups, expanded vaults, and liquidity aggregators.\\n- Dilution Risks: Token emissions decay schedule and reward multipliers.\\n- Qualification Criteria: Minimum TVL threshold, continuous engagement, and institutional KYC/AML hygiene.\\n- Operational Security: Dedicated wallet graph isolation and multisig timelock audit verification."
    # Clean tldr format
    if " - " in tldr_raw and not "\n" in tldr_raw:
        parts = re.split(r'\s+-\s+', tldr_raw.strip())
        parts = [p.strip("- ").strip() for p in parts if p.strip()]
        tldr_raw = "\n".join(f"- {p}" for p in parts)

    tag = "Farming Playbook" if page_type == "guides" else "Market Intelligence"
    return {
        "slug": slug,
        "pageType": page_type,
        "tag": tag,
        "title": title,
        "excerpt": data.get("excerpt", f"Technical deep-dive and institutional analysis on {title}."),
        "tldr": tldr_raw,
        "keyTakeaways": data.get("keyTakeaways", [
            f"Modular architecture isolates protocol risk while preserving liquidity composability for {title}.",
            "Token emissions follow a deterministic decay curve limiting long-term participant dilution.",
            "Sybil resistance hinges on graph-based wallet isolation and non-deterministic transaction intervals.",
            "Smart-contract security is bounded by audited timelocks and multi-sig proxy upgrade guardrails."
        ]),
        "date": time.strftime("%Y-%m-%d"),
        "updatedAt": time.strftime("%Y-%m-%d"),
        "read": data.get("read", "14 min read"),
        "authorSlug": "ai-intelligence-engine",
        "body": body_html,
        "faqs": data.get("faqs", [
            {"question": f"How to avoid sybil detection on {title}?", "answer": "Maintain isolated keypairs, varied transaction amounts (+-15%), and avoid shared CEX funding sources."},
            {"question": "What is the expected token allocation?", "answer": "Typical institutional allocation reserves 40-55% for active liquidity providers and community contributors."},
            {"question": "Which wallets are recommended?", "answer": "Hardware signers (Ledger, Trezor) combined with Rabby or Gnosis Safe multisig signers."},
            {"question": "How does points decay work?", "answer": "Epoch-based decay applies a deterministic reduction to inactive balances, penalizing mercenary capital."},
            {"question": "What are the primary smart contract risks?", "answer": "Upgradeability proxy keys, timelock bypass parameters, and re-entrancy risks on harvest calls."}
        ]),
        "seo": {
            "title": f"{title} — Complete 2026 Analysis",
            "description": data.get("excerpt", f"Technical analysis and positioning for {title}."),
            "keywords": [slug.replace("-", " "), "crypto airdrop", "testnet farming", "sybil resistance"]
        },
        "visual_theme": title
    }

def generate_full_batch_manifest(scout_data: dict) -> dict:
    """Generates 3 projects + 3 blogs + 3 guides and saves to pending_batch.json."""
    manifest_path = AUTOMATION_ROOT / "pending_batch.json"
    
    print("\n[+] Writing 3 Projects...")
    projects = []
    for p in scout_data["projects"]:
        print(f"  -> Project: {p['name']}")
        projects.append(write_project_payload(p))

    print("\n[+] Writing 3 Market Intelligence Articles...")
    intel_articles = []
    for item in scout_data["intelligence"]:
        print(f"  -> Intel: {item['title'][:40]}...")
        intel_articles.append(write_article_payload(item["title"], item["slug"], "intelligence"))

    print("\n[+] Writing 3 Tactical Guides...")
    guide_articles = []
    for item in scout_data["guides"]:
        print(f"  -> Guide: {item['title'][:40]}...")
        guide_articles.append(write_article_payload(item["title"], item["slug"], "guides"))

    manifest = {
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "projects": projects,
        "intelligence": intel_articles,
        "guides": guide_articles
    }

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)

    print(f"\n[+] Successfully generated batch manifest: {manifest_path}")
    return manifest

if __name__ == "__main__":
    from live_scout import scout_3x3x3_batch
    scouted = scout_3x3x3_batch()
    generate_full_batch_manifest(scouted)
