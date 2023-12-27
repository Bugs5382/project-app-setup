module.exports = {
  "verifyConditions": ['@semantic-release/changelog', '@semantic-release/npm', '@semantic-release/git'],
  "plugins": [
    '@semantic-release/commit-analyzer',
    // '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        "assets": ["package.json", "CHANGELOG.md"],
        "message": "chore(release): ${nextRelease.version} [ci skip]\n\n${nextRelease.notes}"
      }
    ],
    // "@semantic-release/github"
  ],
  "branches": [
    "main"
  ]
}
