# Report Viewer - Frontend
## Required API per page
### /
- list all active repos
  - of user
  - of organization

### /:orgs
- list all repos for organization/user

### /:orgs/:repo
- list branches in repo

### /:orgs/:repo/settings
- is user admin of repo?

### /:orgs/:repo/:branch
- list commits in branch

### /:orgs/:repo/:branch/:commit
- list files

### /:orgs/:repo/:branch/:commit/file
- (view file)
