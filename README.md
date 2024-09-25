# Interview-Trexquant

You are creating a version control visualizer for a company. They have nodes representing specific versions, and would like a platform to add, track and edit these versions.

[Figma Link](https://www.figma.com/design/PpS7K9ujjWFKleJ9mF6YqK/Interview-Assessment?node-id=0-1&t=eKVp0Pgp4t2Ubc4e-1)

## Instructions to use the platform
[] Login to the version-control platform
[] Drag and drop to create new nodes
[] Right click to 'Add comments' or 'Find root path'
[] Type in input box to update and add new comments
[] Try refreshing to check session management

## Temporary Credentials to login
[] userName: `"test1"`
[] password: `"pass"`

User requirements:

- Add a new node to the history.
- Branch off of a node in the history.
- View the path to the original node.
- Be able to add and edit comments to any node.
- The state of the version history should persist between sessions of your application.

For your project, please do the following:

- Duplicate the given figma.
- Add a page to this figma with a detailed design of the user requirements.
  - We have specifically kept the design vague to encourage showing off your design skills.
- Fork this Github repo.
- Implement the project using Typescript, Next JS (Or related framework), and any design system you like.
- Place your code and your figma file in the repo.
  - We will be looking at your commit history and your Github best practices.

BONUS:
Allow the user to revert to a certain node in the history. This will delete all the nodes proceeding that node. When a user returns to your application, the reverted state should persist between sessions of your application.
