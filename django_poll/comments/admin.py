from django.contrib import admin
from .models import Comment, CommentLike, CommentDislike

# Register your models here.
class CommentAdmin(admin.ModelAdmin):
	fieldsets = [
        (None,               {'fields': ['comment_text']}),
        ('Date information', {'fields': ['date_posted'], 'classes': ['collapse']}),
        ('Likes',            {'fields': ['likes']}),
        ('Dislikes',         {'fields': ['dislikes']})
    ]
admin.site.register(Comment, CommentAdmin)
admin.site.register(CommentLike)
admin.site.register(CommentDislike)