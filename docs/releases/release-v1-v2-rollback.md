## Rollback configuration lesson

The first rollback changed API and frontend image tags from `1.1.0` to `1.0.0`
successfully. However, the API initially continued to report application version
`1.1.0` because `APP_VERSION` was supplied by a Kubernetes ConfigMap and the
ConfigMap was not restored by the image rollback.

The recovery procedure was updated to restore both:

1. The known-good API and frontend image tags.
2. The known-good ConfigMap release values.

The API Deployment was restarted after updating the ConfigMap because
environment variables loaded from ConfigMaps are applied when Pods start.