from django.utils import timezone

def stringify_time(date_time):
    if date_time.day == timezone.now().day:
        return date_time.strftime("%H:%M")
    elif date_time.month == timezone.now().month:
        return date_time.strftime("%b %d")
    return date_time.strftime("%d/%m/%y")
