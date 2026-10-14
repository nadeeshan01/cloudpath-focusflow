# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Full-stack ECR repositories

The project uses two immutable ECR repositories:

- `cloudpath-focusflow-api-dev`
- `cloudpath-focusflow-web-dev`

The API repository stores the Node.js/Express image.
The web repository stores the React/Nginx image.

Images are tagged with commit SHA values for release traceability and rollback.

## Expected low-cost resources

- Two ECR repositories.
- ECR lifecycle policies.
- CloudWatch log group with 7-day retention.
- GitHub OIDC provider.
- Least-privilege GitHub Actions role.

## Excluded resources

- EKS
- EC2
- NAT Gateway
- RDS
- Application Load Balancer