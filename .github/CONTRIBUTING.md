# Contributing

Thank you for considering contributing to this product! We welcome any contributions, whether it's bug fixes, new features, or improvements to the existing codebase.

### Your First Pull Request

Working on your first Pull Request? You can learn how from this free video series:

[How to Contribute to an Open Source Project on GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

To help you get familiar with our contribution process, we have a list of [good first issues](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) that contain bugs that have a relatively limited scope. This is a great place to get started.

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don’t accidentally duplicate your effort.

If somebody claims an issue but doesn’t follow up for more than two weeks, it’s fine to take it over but you should still leave a comment. **Issues won't be assigned to anyone outside the core team**.

### Contribution Prerequisites

#### Development Environment Setup

The Ordinals Explorer is a Next.js application built with TypeScript and requires the following prerequisites:

- **Node.js**: Version 18 or higher ([Download here](https://nodejs.org/))
- **npm**: Comes with Node.js, or use yarn/pnpm
- **Git**: For version control

```bash
# Verify installations
node --version
npm --version
git --version
```

#### Setting Up the Project

```bash
# Clone the repository
git clone https://github.com/hirosystems/ordinals-explorer.git
cd ordinals-explorer

# Copy environment variables
cp .env.sample .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Development Workflow

#### 1. Choose an Issue

- Check our [good first issues](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) for beginner-friendly tasks
- Look for issues labeled `help wanted`, `enhancement`, or `bug`
- Comment on the issue to indicate you're working on it

#### 2. Create a Feature Branch

```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/issue-number-description
```

#### 3. Make Your Changes

- Follow TypeScript and React best practices
- Use the existing component patterns and styling
- Write tests for new functionality
- Ensure your code passes linting: `npm run lint`
- Test your changes locally

#### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat: add inscription search functionality

- Add search bar to inscription list page
- Implement search by inscription ID and content
- Add loading states and error handling"
```

We follow [Conventional Commits](https://www.conventionalcommits.org/) format:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for test-related changes

#### 5. Test Your Changes

```bash
# Run linting
npm run lint

# Build the project to check for TypeScript errors
npm run build

# Run tests (if available)
npm test
```

#### 6. Update Documentation

- Update component documentation if you add new props
- Update README.md if you add major features
- Add JSDoc comments for new functions

#### 7. Submit a Pull Request

```bash
# Push your branch to GitHub
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub:

1. Go to the repository on GitHub
2. Click "Compare & pull request"
3. Fill in the PR template:
   - **Title**: Clear, descriptive title following conventional commit format
   - **Description**: Explain what the change does and why
   - **Testing**: Describe how you tested the changes
   - **Screenshots**: Include screenshots for UI changes

### Code Standards

#### TypeScript/React Guidelines

- Use TypeScript for all new code
- Follow the existing component structure and patterns
- Use functional components with hooks
- Implement proper TypeScript types for props and state
- Use meaningful variable and function names
- Handle loading and error states appropriately

#### Styling

- Use Tailwind CSS classes as defined in the project
- Follow the existing design system and color scheme
- Ensure responsive design for mobile and desktop
- Test UI changes across different screen sizes

#### File Organization

- Keep components in the `components/` directory
- Use the app router structure in `app/`
- Place utility functions in `lib/`
- Follow the existing file naming conventions

#### Testing

- Write unit tests for utility functions
- Test component interactions and user flows
- Include integration tests for API calls
- Test error handling and edge cases

#### Documentation

- Add JSDoc comments for complex functions
- Document component props with TypeScript interfaces
- Update README for new features
- Keep inline comments clear and helpful

### Communication

- **GitHub Issues**: For bug reports, feature requests, and general discussion
- **GitHub Discussions**: For questions and community discussion
- **Discord**: Join our [Discord community](https://stacks.chat/) for real-time help

### Review Process

1. A maintainer will review your PR within a few business days
2. They may request changes or ask questions
3. Address review feedback by pushing additional commits
4. Once approved, a maintainer will merge your PR

### Recognition

Contributors are recognized in our release notes and on our contributor acknowledgments. We appreciate all contributions, big and small!

Thank you for contributing to the Ordinals Explorer! 🎉
