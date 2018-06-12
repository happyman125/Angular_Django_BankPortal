# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-06-26 16:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_auto_20160626_1652'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='genre',
            field=models.IntegerField(choices=[(0, 'Adventure'), (1, 'Action'), (2, 'Fighter'), (3, 'Music'), (4, 'Platformer'), (5, 'Puzzle'), (6, 'Racing'), (7, 'RPG'), (8, 'Sports'), (9, 'Strategy')], default=0),
        ),
        migrations.AlterField(
            model_name='game',
            name='platform',
            field=models.IntegerField(choices=[(0, 'PS4'), (1, 'PS3'), (2, 'PS Vita'), (3, 'WII U'), (4, 'WII'), (5, '3DS'), (6, 'PC'), (7, 'XBONE'), (8, 'XBOX 360'), (9, 'iOS'), (10, 'Android')], default=0),
        ),
        migrations.AlterField(
            model_name='game',
            name='release_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
