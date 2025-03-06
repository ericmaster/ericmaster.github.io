---
title: 'Installing Self-managed Gitlab on your own server '
pubDate: 2025-03-06
description: 'Install your own self-hosted gitlab server.'
author: 'Eric Aguayo'
image:
    url: 'https://images.ctfassets.net/xz1dnu24egyd/3JZABhkTjUT76LCIclV7sH/cc2f52df0e32f639eb01c06a4816ede0/gitlab-logo-500.svg'
    alt: 'The gitlab logo.'
tags: ["git", "gitlab", "self-hosted"]
---
# Installing Self-managed GitLab on your own server and setup

Published on: 2025-03-06

## Introduction

If you are reading this, you are probably already familiar with GitLab, and probably already have an account in [GitLab Cloud Service](https://www.gitlab.com). If that is not the case, no worries I will briefly explain what GitLab is and why you may want to self-host your own instance.

## TLDR;

Just follow the [instructions from the official site](https://about.gitlab.com/install/) according to your operating system or platform. This is pretty well documented.

## Why you may want a self-hosted GitLab instance.

* Customization and personalization features
* Access control
* Security and privacy
* Performance

## Installing gitlab

### Step 1. Install and configure the necessary dependencies

There are many different operating systems supported with detailed instructions. So far I've done in Oracle Linux 8 and Debian 11. Dependencies vary slightly for each system and you should be able to get the dependencies through the corresponding package manager. For Debian/Ubuntu for instance

> sudo apt-get update && sudo apt-get install -y curl openssh-server ca-certificates perl

For Ubuntu you may need to install the tzdata package as well

For Oracle Linux or RHEL derived distro

> sudo dnf install -y curl policycoreutils openssh-server perl

### Step 2. Add the GitLab package repository and install the package

Oracle Linux 8 is probably fully supported now but when it came out it wasn't under the supported releases so the suggested command

> curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash
