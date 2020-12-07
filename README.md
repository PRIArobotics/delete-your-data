# Delete Your Data

**Delete Your Data (DYD)** helps platform providers in granting their users' rights to information, access, rectification, and erasure of their data.

## Who is DYD for?

Delete Your Data is for platform providers who process data on behalf on and about their users.
If you are subject to EU jurisdiction, want to be safe for potential future developments in privacy regulations, or simply care about your users' privacy, using DYD can help you implement necessary features.
Right now, DYD is most suited to newly developed platforms, as existing personal data can not be automatically indexed by DYD.

## What does DYD do?

Conceptually, DYD is another web service that stands independently next to your own platform(s).
Your platform communicates with DYD via REST, and a plugin architecture is used to let DYD talk back.

With some not-too-complex integration work (calling some DYD REST endpoints), DYD indexes all references to personal data on your platform when those are created. Subsequently, that index can be used to respond to information or deletion requests by users: on a request, DYD uses the relevant plugin(s) to invoke connected service(s) to retrieve, anonymize, or delete personal data.

DYD takes into account that one person may have accounts on different systems that belong to the same platform, and can operate on a single account or on all accounts that belong to the same person.
At the same time, DYD naturally compartmentalizes data by the service they are stored in, and is therefore inherently ably to manage data of multiple separate platforms.
There is no need to host separate DYD instances for separate platforms.

What DYD is *not*:
- a library: DYD is an application hosted next to your own platform, with its own database and REST API.
  That means it does not lock your platform into a specific language, framework, or architecture.
- a user-facing part of your website: at least not specifically. DYD is at its core a tool for platform *providers*, who have obligations to their users.
  The core functionality of DYD is to allow admins of that platform to query and erase information on behalf of their users - i.e. there is a human (admin) in the loop with each such request.
  Of course, the same APIs that power the DYD admin interface can be used to let users access or erase their data directly, via any means you grant them.
- a storage system for personal data: to the contrary, DYD by design contains no personal data at all.
  The index that DYD builds contains only IDs, and "native" IDs that are used by the connected systems.
  That means, as long as those "native" IDs do not contain personal data (such as user-chosen usernames or similar identifiers), DYD is *not* a system for processing personal data and does not add to any related headaches.
- a complete GDPR solution: the GDPR is complex and comprehensive, and DYD helps in implementing some of the rights it grants.
  Others, such as gathering consent, are served by other services and technologies.
  Furthermore, basic data protection (such as general security of the systems that store and process user data) can not be provided by an add-on service such as DYD

# This repository

This repository contains three directory:

- [`dyd/`](dyd/) is the actual DYD application; more details on its usage can be found there
- [`dummy-service/`](dummy-service/) is a minimal web application that is used in automated tests of DYD.
  It consists of a data model and a REST API.
- [`dyd-dummy-plugin/`](dyd-dummy-plugin/) is a plugin that connects DYD to the dummy service; this is used for testing as well, and can be used as a template for plugins.
  The [source code](dyd-dummy-plugin/src/) comprises only two files.


