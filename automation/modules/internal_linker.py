import re
from bs4 import BeautifulSoup, NavigableString

# Authoritative Verified Entity Registry
DEFAULT_ENTITIES = [
    # Guides (Longer phrases prioritized)
    {"name": "avoiding sybil detection", "slug": "avoiding-sybil-detection", "type": "guide", "url": "/guides/avoiding-sybil-detection/"},
    {"name": "sybil detection", "slug": "avoiding-sybil-detection", "type": "guide", "url": "/guides/avoiding-sybil-detection/"},
    {"name": "sybil defense", "slug": "avoiding-sybil-detection", "type": "guide", "url": "/guides/avoiding-sybil-detection/"},
    {"name": "setting up a farming wallet", "slug": "setting-up-a-farming-wallet", "type": "guide", "url": "/guides/setting-up-a-farming-wallet/"},
    {"name": "farming wallet", "slug": "setting-up-a-farming-wallet", "type": "guide", "url": "/guides/setting-up-a-farming-wallet/"},
    {"name": "bridging to layer 2 networks", "slug": "bridging-to-layer-2-networks", "type": "guide", "url": "/guides/bridging-to-layer-2-networks/"},
    {"name": "layer 2 bridging", "slug": "bridging-to-layer-2-networks", "type": "guide", "url": "/guides/bridging-to-layer-2-networks/"},
    {"name": "understanding snapshot mechanics", "slug": "understanding-snapshot-mechanics", "type": "guide", "url": "/guides/understanding-snapshot-mechanics/"},
    {"name": "snapshot mechanics", "slug": "understanding-snapshot-mechanics", "type": "guide", "url": "/guides/understanding-snapshot-mechanics/"},
    
    # Hubs
    {"name": "airdrop projects", "slug": "projects", "type": "guide", "url": "/projects/"},
    {"name": "airdrop evaluation methodology", "slug": "methodology", "type": "guide", "url": "/methodology/"},

    # Verified Airdrop Projects
    {"name": "privacy pools", "slug": "privacy-pools", "type": "project", "url": "/projects/privacy-pools/"},
    {"name": "ondo perps", "slug": "ondo-perps", "type": "project", "url": "/projects/ondo-perps/"},
    {"name": "hoodtracker", "slug": "hoodtracker", "type": "project", "url": "/projects/hoodtracker/"},
    {"name": "hypertrade", "slug": "hypertrade", "type": "project", "url": "/projects/hypertrade/"},
    {"name": "solpump", "slug": "solpump", "type": "project", "url": "/projects/solpump/"},
    {"name": "jupiter", "slug": "jupiter", "type": "project", "url": "/projects/jupiter/"},
    {"name": "3jane", "slug": "3jane", "type": "project", "url": "/projects/3jane/"},
    {"name": "arcus", "slug": "arcus", "type": "project", "url": "/projects/arcus/"},
    {"name": "ducat", "slug": "ducat", "type": "project", "url": "/projects/ducat/"},
    {"name": "legend", "slug": "legend", "type": "project", "url": "/projects/legend/"},
    {"name": "monad", "slug": "monad", "type": "project", "url": "/projects/monad/"},
    {"name": "gmgn", "slug": "gmgn", "type": "project", "url": "/projects/gmgn/"}
]

EXCLUDED_TAGS = {"a", "h1", "h2", "h3", "h4", "h5", "h6", "nav", "footer", "pre", "code", "script", "style"}

def inject_internal_links(html_content: str, custom_entities: list = None, current_slug: str = None) -> tuple[str, list[dict]]:
    """
    Parses HTML content using BeautifulSoup and injects canonical internal links.
    - Longest entity first priority.
    - Word boundary matching (e.g. 'monad' will not match 'monadic').
    - Maximum 1 link per entity per article.
    - Skips already-linked text, headings, code, and navigation elements.
    - Returns (modified_html, list_of_linked_entities).
    """
    entities = custom_entities if custom_entities is not None else DEFAULT_ENTITIES
    # Sort longest entity name first
    sorted_entities = sorted(entities, key=lambda x: len(x["name"]), reverse=True)
    
    soup = BeautifulSoup(html_content, "html.parser")
    linked_entities = []
    linked_slugs = set()
    
    if current_slug:
        linked_slugs.add(current_slug) # Do not link to self

    def is_inside_excluded_tag(element):
        curr = element.parent
        while curr:
            if curr.name in EXCLUDED_TAGS:
                return True
            curr = curr.parent
        return False

    for ent in sorted_entities:
        ent_name = ent["name"]
        ent_slug = ent["slug"]
        ent_type = ent["type"]
        ent_url = ent["url"]
        
        if ent_slug in linked_slugs:
            continue
            
        pattern = re.compile(rf"\b({re.escape(ent_name)})\b", re.IGNORECASE)
        
        # Find candidate text nodes
        text_nodes = [t for t in soup.find_all(string=True) if isinstance(t, NavigableString) and not is_inside_excluded_tag(t)]
        
        for node in text_nodes:
            match = pattern.search(node)
            if match:
                matched_text = match.group(1)
                start, end = match.span()
                
                # Split node into before, link, after
                before_text = node[:start]
                after_text = node[end:]
                
                new_a = soup.new_tag("a", href=ent_url)
                new_a.string = matched_text
                
                # Replace the original text node
                parent = node.parent
                idx = parent.contents.index(node)
                
                # Insert in place
                parent.contents.pop(idx)
                if after_text:
                    parent.insert(idx, NavigableString(after_text))
                parent.insert(idx, new_a)
                if before_text:
                    parent.insert(idx, NavigableString(before_text))
                
                linked_slugs.add(ent_slug)
                linked_entities.append({
                    "entity_type": ent_type,
                    "entity_slug": ent_slug,
                    "anchor_text": matched_text,
                    "target_url": ent_url
                })
                break # Strictly max 1 link per entity

    # Return valid HTML string
    return str(soup), linked_entities
