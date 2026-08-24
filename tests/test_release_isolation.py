import unittest

# Mock database records
MOCK_POSTS_DB = [
    {"id": "post-c-uuid", "slug": "monad-playbook", "status": "published", "title": "Published Post C"},
    {"id": "post-a-uuid", "slug": "berachain-v2-guide", "status": "staged", "title": "Staged Post A"},
    {"id": "post-b-uuid", "slug": "story-protocol-strategy", "status": "staged", "title": "Staged Post B"}
]

MOCK_RELEASES_DB = {
    "release-a-uuid": {"release_id": "release-a-uuid", "target_post_id": "post-a-uuid", "status": "created"},
    "release-b-uuid": {"release_id": "release-b-uuid", "target_post_id": "post-b-uuid", "status": "created"}
}

def simulate_scoped_build_query(target_release_id=None, target_post_id=None):
    """
    Simulates the scoped build query implemented in lib/cms/blogService.ts
    """
    if target_release_id and target_post_id:
        # Validate release existence and matching target post
        rel = MOCK_RELEASES_DB.get(target_release_id)
        if rel and rel["target_post_id"] == target_post_id:
            return [
                p for p in MOCK_POSTS_DB
                if p["status"] == "published" or (p["status"] == "staged" and p["id"] == target_post_id)
            ]
        else:
            raise ValueError("Release verification failed in database!")
    else:
        # Global rebuild: ONLY published posts
        return [p for p in MOCK_POSTS_DB if p["status"] == "published"]

class TestReleaseIsolation(unittest.TestCase):

    def test_release_a_includes_published_and_post_a_only(self):
        result = simulate_scoped_build_query(target_release_id="release-a-uuid", target_post_id="post-a-uuid")
        slugs = [p["slug"] for p in result]
        
        # Must include Published Post C
        self.assertIn("monad-playbook", slugs)
        # Must include Staged Post A
        self.assertIn("berachain-v2-guide", slugs)
        # Must NOT include Staged Post B
        self.assertNotIn("story-protocol-strategy", slugs)
        self.assertEqual(len(result), 2)

    def test_global_rebuild_includes_published_only(self):
        result = simulate_scoped_build_query()
        slugs = [p["slug"] for p in result]
        
        self.assertIn("monad-playbook", slugs)
        self.assertNotIn("berachain-v2-guide", slugs)
        self.assertNotIn("story-protocol-strategy", slugs)
        self.assertEqual(len(result), 1)

    def test_mismatched_release_and_post_id_fails(self):
        with self.assertRaises(ValueError):
            simulate_scoped_build_query(target_release_id="release-a-uuid", target_post_id="post-b-uuid")

if __name__ == "__main__":
    unittest.main()
