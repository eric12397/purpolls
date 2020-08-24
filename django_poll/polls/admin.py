from django.contrib import admin
from .models import Choice, Poll, Vote, Like, Dislike
from comments.models import Comment 

# Register your models here.
class ChoiceInline(admin.TabularInline):
	model = Choice
	extra = 3

class CommentInline(admin.TabularInline):
	model = Comment


class PollAdmin(admin.ModelAdmin):
	fieldsets = [
        (None,               {'fields': ['question_text']}),
        ('Date information', {'fields': ['date_posted'], 'classes': ['collapse']}),
        ('Likes',            {'fields': ['likes', 'dislikes']}),
    ]
	inlines = [ChoiceInline, CommentInline]
	list_display = ('question_text', 'date_posted',)
	list_filter = ['date_posted']
	search_fields = ['question_text']
	
admin.site.register(Poll, PollAdmin)
admin.site.register(Vote)
admin.site.register(Like)
admin.site.register(Dislike)