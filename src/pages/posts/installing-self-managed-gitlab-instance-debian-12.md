---
layout: ../../layouts/MarkdownPostLayout.astro
pubDate: 2025-03-06
author: Eric Aguayo
title: Host Your Own GitLab Repository Server on Linux (Debian 12)
published: true
tags:
  - devops
  - git
  - gitlab
  - self-hosted
slug: installing-self-managed-gitlab-instance-debian-12
image:
  url: /assets/images/installing-gitlab.jpg
  alt: The gitlab logo.
description: When working with development tools, having a place to store and
  manage your code is essential. While many cloud-based services are available,
  a self-hosted solution offers greater control over versioning and CI/CD
  pipelines. You can achieve this by setting up your own GitLab server,
  providing full ownership and customization of your repositories and workflows.
---
## Introduction

If you are reading this, you are probably already familiar with GitLab, and probably already have an account in [GitLab Cloud Service](https://www.gitlab.com) or a similar cloud service. If this is not the case, no worries I will briefly explain what GitLab is and why you may want to self-host your own instance.

## TLDR;

You just need to jump to the [Installing gitlab](#install) section and execute the first 2 steps for *Debian 12* or follow the [instructions from the official site](https://about.gitlab.com/install/) according to your operating system or platform. This is pretty well documented. For instance, [Ubuntu distribution](https://about.gitlab.com/install/#ubuntu) takes as little as 5 steps according to the official documentation.

## Why you may want a self-hosted GitLab instance.

### Customization and Personalization features

Self-hosting a Gitlab instance gives you full control over it, including Admin Area, Users manangement and System settings. In addition you can implement custom Git hooks at server-level to enforce specific policies and performing tasks based on the state of a repository. A self-hosted Gitlab instance allows you to setup a custom authentication workflow with any authentication provider that uses a standard protocol. You can also customize your install with the Gitlab features you need by enabling or disabling feature flags through the rails console for a more streamlined experience.

### Access Control

You (or your company) may have an authentication provider where you have centralized control of your users (like LDAP, Active Directory, and SAML) and may want to re-use it instead of having a separate authentication credentials for each user (including yourself).

### Security and Privacy

If you are concerned about the treatment of your data in the cloud, have particular policies related to security and privacy or due to the nature of your business have to enforce some requirements then self-hosting Gitlab may be your option. Self-hosting gives you the ability to manage and configure encryption settings, including using internal encryption keys. In addition, you get full access to compliance-related features and logs, aiding in meeting regulatory requirements. 

### Performance

One of the advantages of self-hosting is that you have the control of the infrastructure where gitlab is installed. That means, if you have some idle computing power in your infrastructure then you can use it for Gitlab CI/CD operation for instance. Also, by disabling features you don't need or use you may increase the efficiency of your setup.

## <a name="install"></a>Installing gitlab

### Step 1. Install and configure the necessary dependencies

There are many different operating systems supported with detailed instructions. When writting this I used Debian 12. Dependencies vary slightly for each system but you should be able to get the dependencies through the corresponding package manager. For Debian/Ubuntu for instance

```bash
$ sudo apt-get update && sudo apt-get install -y curl openssh-server ca-certificates perl
```

You can optionally install `postfix` if you want to send notification emails in the same installation, but you can also connect to an external SMTP server, if so, you can skip the following command line.

```bash
$ sudo apt-get install -y postfix
```

<br />

### Step 2. Add the GitLab package repository and install the package

To add the package repository you can add the following line, it will download the setup script and install Gitlab Community Edition. The official documentation instructions by default are written so that you install the Enterprise Edition (`gitlab-ee`) but you can change the command by updating the URL to point to the Community Edition (`gitlab-ce`) or changing the URL to append `?version=ce` depending on what you want. You can see the differences between editions in the [official site](https://about.gitlab.com/install/ce-or-ee/)

```bash
$ curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | sudo bash
```

The script will update your package manager cache and install a few additional required packages. After this, you can install Gitlab and specify the URL that you want to use to access it, in my case I used `http://gitlab-dev.local` but you can use whatever domain you own. Note I didn't use `https` protocol, instead I used `http` so I can access it locally, but you can change this later. Also, if you specify `https`, the setup will attempt to request a certificate via `Let's Encrypt` but you can also use your own certificate.

```bash
$ sudo EXTERNAL_URL="http://gitlab-dev.local" apt-get install gitlab-ce
```

**Note on LXC Containers:** If you are installing on LXC containers (like ProxmoxVE), make sure that the container is NOT unprivileged and/or remove any LXC restrictions. If you cannot install on a privileged container, you will need to set the following line in `/etc/gitlab/gitlab.rb`

```
package[‘modify_kernel_parameters’] = false
```

then retry the setup with `gitlab-ctl reconfigure`

After you leave it running for a while, if everything ran successfully it will output the following text (with the `EXTERNAL_URL` you set)

```
       *.                  *.
      ***                 ***
     *****               *****
    .******             *******
    ********            ********
   ,,,,,,,,,***********,,,,,,,,,
  ,,,,,,,,,,,*********,,,,,,,,,,,
  .,,,,,,,,,,,*******,,,,,,,,,,,,
      ,,,,,,,,,*****,,,,,,,,,.
         ,,,,,,,****,,,,,,
            .,,,***,,,,
                ,*,.



     _______ __  __          __
    / ____(_) /_/ /   ____ _/ /_
   / / __/ / __/ /   / __ `/ __ \
  / /_/ / / /_/ /___/ /_/ / /_/ /
  \____/_/\__/_____/\__,_/_.___/


Thank you for installing GitLab!
GitLab should be available at http://gitlab-dev.local

For a comprehensive list of configuration options please see the Omnibus GitLab readme
https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/README.md

Help us improve the installation experience, let us know how we did with a 1 minute survey:
https://gitlab.fra1.qualtrics.com/jfe/form/SV_6kVqZANThUQ1bZb?installation=omnibus&release=18-0
```

### Step 3. Enter the URL in the browser and login

When you get the URL in the browser you will be presented the following screen:

![image](/assets/images/gitlab-login.jpg)

The default username is `root` and the initial password is stored in `/etc/gitlab/initial_root_password` which is cleaned up after 24 hours. It is highly recommended to reset the password after your first login.

### Step 4. Next steps

You could skip this step and start using your new Gitlab instance but I would go through the following as a next steps:

#### Ensure that e-mail notifications are working

Test your e-mails, you can do this by entering the `gitlab-rails console` and executing the following line to send a test e-mail

```
Notify.test_email('destination_email@address.com', 'Message Subject', 'Message Body').deliver_now
```

If you opted for setting up e-mail notifications via SMTP, make sure to go to the [SMTP settings documentation](https://docs.gitlab.com/omnibus/settings/smtp/)

#### Setup CI/CD Runners

If you are going to use the `CI/CD` capabilities of gitlab, you will need to [setup one or more runners](https://docs.gitlab.com/runner/) which are basically applications that can live on the same gitlab server or can be on an external server (or servers) that executes the required jobs from a CI/CD pipeline.

When you define a CI/CD workflow it is likely you will execute the jobs in containers. Make sure to go through the [Container Registry](https://docs.gitlab.com/administration/packages/container_registry/) and [Gitlab Dependency Proxy](https://docs.gitlab.com/administration/packages/dependency_proxy/) documentation

#### Gitlab Pages

If you plan to publish static website from a repository in your instance make sure to check the [Gitlab Pages documentation](https://docs.gitlab.com/user/project/pages/)

#### Secure your Gitlab server

Make sure to go through the [recommendations](https://docs.gitlab.com/security/) to secure your setup.

If you opted for not setting up HTTPS at the time of installation, make sure to go through [this documentation](https://docs.gitlab.com/omnibus/settings/ssl/#configure-https-manually) before making your instance publicly accessible.

Security patches are released from time to time so it is important that you have an upgrade schedule or schema of some sort.

#### Authentication

If you are going to be managing your credentials directly through your Gitlab instance you can skip this. Otherwise, you can [Integrate with LDAP](https://docs.gitlab.com/administration/auth/ldap/) or [authenticate via SAML/OAuth protocols](https://docs.gitlab.com/integration/omniauth/)

#### Backup and upgrade

Finally, secure your code and your data by setting up a [Backup and Restore](https://docs.gitlab.com/administration/backup_restore/) process. You will need to do this if you are upgrading from a too old version or you want to migrate your instance to another server.

### Conclusions

Gitlab setup is streamlined into 4 steps, only the 2 first requiring executing some lines of code and with the last being *optional* if you want to use it right away.
