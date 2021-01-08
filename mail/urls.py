from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("emails/send", views.compose, name="compose"),
    path("emails/<int:email_id>", views.email, name="email"),
    path("emails/<int:email_id>/delete", views.delete_email, name="delete"),
    path("emails/<str:mailbox>", views.mailbox, name="mailbox"),
]
