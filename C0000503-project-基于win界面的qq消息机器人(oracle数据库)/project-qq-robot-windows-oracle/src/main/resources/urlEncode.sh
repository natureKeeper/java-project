#!/bin/sh

echo "#coding=utf-8;
import urllib,sys;print urllib.quote('$1');"|python