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
        
        # Determine if the current user already liked each post
        user_liked = Count('like', filter=Q(user=self.request.user))
        queryset = queryset.annotate(user_liked=user_liked)

        queryset = queryset.order_by("-timestamp")
        return queryset

    def get_context_data(self, *args, **kwargs):
        context_data = super().get_context_data(*args, **kwargs)
        
        user_id = self.request.GET.get('user')
        if user_id:
            context_data['requested_user'] = User.objects.get(pk=user_id)

        return context_data

        
@csrf_exempt
@login_required
def compose(request):

    # Composing a new post must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Check recipient emails
    print ("request body", request.body)
    data = json.loads(request.body)
    content = data.get("content")
    if not content:
        return JsonResponse({
            "error": "Post content required."
        }, status=400)

    post = Post(
        content=content,
        user=request.user
    )

    post.save()

    return JsonResponse({"message": "Post created successfully."}, status=201)

def user(request, user_id):
    user = User.objects.get(pk=user_id)
    context = {"user": user}

    return render(request, "network/user.html", context=context)

@csrf_exempt
@login_required
def like(request):
    if request.method != "POST" and request.method != "DELETE":
        return JsonResponse({"error": "POST or DELETE request required."}, status=400)

    print ("request body", request.body)
    data = json.loads(request.body)
    post = data.get("post")
    if not post:
        return JsonResponse({
            "error": "Post required."
        }, status=400)
    if request.method == "POST":
        post = Post.objects.get(pk=post)
        like = Like(
            post=post,
            user=request.user
        )

        like.save()

        return JsonResponse({"message": "Like successful."}, status=201)

    elif request.method == "DELETE":
        like = Like.objects.filter(post__pk=post, user=request.user)
        like.delete()
        return JsonResponse({"message": "Unlike successful."})


@csrf_exempt
@login_required
def follow(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    # Check recipient emails
    print ("request body", request.body)
    data = json.loads(request.body)
    follower = data.get("follower")
    if not follower:
        return JsonResponse({
            "error": "Post required."
        }, status=400)

    follow = Follow.objects.get(pk=User)
    follow = Follow(
        follower=request.user,
        followee=request.user
    )

    follow.save()

    return JsonResponse({"message": "Like successful."}, status=201)