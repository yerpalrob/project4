from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

# Post model foreign key to User
class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

# Like model foreign key to user and to post so unique so users can only like posts 1 time
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    class Meta:
        unique_together = ['user', 'post']

# Follow model 2 foreign key to user unique so that you can only follow someone 1 time
class Follow(models.Model):
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name="following")
    followee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followers")
    class Meta:
        unique_together = ['follower', 'followee']

