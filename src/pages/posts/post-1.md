---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Installing a Self-managed Gitlab Instance on Your Server (Debian 12)"
pubDate: 2025-03-06
description: "When working with development tools, having a place to store and manage your code is essential. While many cloud-based services are available, a self-hosted solution offers greater control over versioning and CI/CD pipelines. You can achieve this by setting up your own GitLab server, providing full ownership and customization of your repositories and workflows."
author: "Eric Aguayo"
image:
  url: "/assets/images/installing-gitlab.jpg"
  alt: "The gitlab logo."
tags: ["git", "gitlab", "self-hosted"]
---

## Introduction

If you are reading this, you are probably already familiar with GitLab, and probably already have an account in [GitLab Cloud Service](https://www.gitlab.com) or a similar cloud service. If this is not the case, no worries I will briefly explain what GitLab is and why you may want to self-host your own instance.

## TLDR;

Just follow the [instructions from the official site](https://about.gitlab.com/install/) according to your operating system or platform. This is pretty well documented. For instance, [Ubuntu distribution takes 5 steps](https://about.gitlab.com/install/#ubuntu)

## Why you may want a self-hosted GitLab instance.

### Customization and Personalization features

Self-hosting a Gitlab instance gives you full control over it, including Admin Area, Users manangement and System settings. In addition you can implement custom Git hooks at server-level to enforce specific policies and performing tasks based on the state of a repository. A self-hosted Gitlab instance allows you to setup a custom authentication workflow with any authentication provider that uses a standard protocol. You can also customize your install with the Gitlab features you need by enabling or disabling feature flags through the rails console for a more streamlined experience.

### Access Control

You (or your company) may have an authentication provider where you have centralized control of your users (like LDAP, Active Directory, and SAML) and may want to re-use it instead of having a separate authentication credentials for each user (including yourself).

### Security and Privacy

Ability to manage and configure encryption settings, including using internal encryption keys. Full access to compliance-related features and logs, aiding in meeting regulatory requirements. 

### Performance



## Installing gitlab

### Step 1. Install and configure the necessary dependencies

There are many different operating systems supported with detailed instructions. When writting this I used Debian 12. Dependencies vary slightly for each system but you should be able to get the dependencies through the corresponding package manager. For Debian/Ubuntu for instance

```bash
$ sudo apt-get update && sudo apt-get install -y curl openssh-server ca-certificates perl
```

### Step 2. Add the GitLab package repository and install the package

Oracle Linux 8 is probably fully supported now but when it came out it wasn't under the supported releases so the suggested command

$ curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash
