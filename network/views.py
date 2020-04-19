import json
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.utils import timezone
from django.views.generic.list import ListView
from .models import User, Post, Like, Follow
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Q
from django.contrib.auth.mixins import LoginRequiredMixin




def index(request):
    return render(request, "network/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")



class PostListView(ListView):

    model = Post
    paginate_by = 10  

    def get_queryset(self, **kwargs):
        queryset = super().get_queryset(**kwargs)
        
        # If a user_id was provided, filter posts by that user
        user_id = self.request.GET.get('user')
        if user_id:
            queryset = queryset.filter(user__id=user_id)

        # Checks that user is logged in
        if not self.request.user.is_anonymous:

            # Determine if the current user already liked each post
            user_liked = Count('like', filter=Q(like__user=self.request.user))
            queryset = queryset.annotate(user_liked=user_liked)

            # Checks who is being followed by the user, filter posts by those users
            following = self.request.GET.get('following')
            if following:
                followed_users = Follow.objects.filter(follower=self.request.user).values_list('followee', flat=True)
                queryset = queryset.filter(user__pk__in=followed_users)

        # Order posts in reverse chronological order
        queryset = queryset.order_by("-timestamp")
        return queryset

    def get_context_data(self, *args, **kwargs):
        context_data = super().get_context_data(*args, **kwargs)
        
        user_id = self.request.GET.get('user')
        if user_id:
            requested_user = User.objects.get(pk=user_id)
            context_data['requested_user'] = requested_user

            if not self.request.user.is_anonymous:
                if Follow.objects.filter(followee=requested_user, follower=self.request.user).exists():
                    context_data['following'] = True
        return context_data
        

        
@csrf_exempt
@login_required
def compose(request):

    # Checks that the method is POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    
    # Gets the content of the post
    print ("request body", request.body)
    data = json.loads(request.body)
    content = data.get("content")
    
    # Verifies there is some content for the post
    if not content:
        return JsonResponse({
            "error": "Post content required."
        }, status=400)

    # Creates the post
    post = Post(
        content=content,
        user=request.user
    )

    # Saves the post
    post.save()
    return JsonResponse({"message": "Post created successfully."}, status=201)

@csrf_exempt
@login_required
def like(request):
    # Verifies that it is either a POST or a DELETE request
    if request.method != "POST" and request.method != "DELETE":
        return JsonResponse({"error": "POST or DELETE request required."}, status=400)
    
    # Finds the post
    print ("request body", request.body)
    data = json.loads(request.body)
    post = data.get("post")
    # If it is not a post
    if not post:
        return JsonResponse({
            "error": "Post required."
        }, status=400)
    # If it was a like/POST add a like
    if request.method == "POST":
        post = Post.objects.get(pk=post)
        like = Like(
            post=post,
            user=request.user
        )
        like.save()
        return JsonResponse({"message": "Like successful."}, status=201)
    # If it was an unlike/DELETE remove a like
    elif request.method == "DELETE":
        like = Like.objects.filter(post__pk=post, user=request.user)
        like.delete()
        return JsonResponse({"message": "Unlike successful."})

@csrf_exempt
@login_required
def follow(request):
    # Verifies that it is either a POST or a DELETE request
    if request.method != "POST" and request.method != "DELETE":
        return JsonResponse({"error": "POST or DELETE request required."}, status=400)

    # Finds the user
    print ("request body", request.body)
    data = json.loads(request.body)
    followee = data.get("followee")
    # If the user does not exist
    if not followee:
        return JsonResponse({
            "error": "followee required."
        }, status=400)
    # If the user is being followed/POST
    if request.method == "POST":
        followee = User.objects.get(pk=followee)
        follow = Follow(
            follower=request.user,
            followee=followee
        )
        follow.save()
        return JsonResponse({"message": "follow successful."}, status=201)
    # If the user is being unfollowed/DELETE
    elif request.method == "DELETE":
        follow = Follow.objects.filter(followee__pk=followee, follower=request.user)
        follow.delete()
        return JsonResponse({"message": "unfollow successful."})  