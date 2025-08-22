# H5NSS — Cluster-Aware Name Service Switch for Linux

A production-grade NSS provider that lets your cluster present **users, groups, and hosts** from a central authority without touching `/etc/passwd`, `/etc/group`, or `/etc/hosts`. Designed for HDF5/compute clusters, H5NSS drops in alongside the system’s default NSS backends and adds **fast, policy-controlled identity and hostname resolution**.

## Why it exists

* **One source of truth.** Keep identities and node addresses in one place—nodes consume them consistently through standard libc lookups.
* **Zero retooling.** Processes keep calling `getpwnam(3)`, `getgrnam(3)`, and `gethostbyname(3)`; H5NSS supplies the answers.
* **Operational safety.** Clear failure semantics and timeouts prevent hangs when the upstream directory is slow/unavailable. &#x20;
* **Least privilege on nodes.** No secrets or bulky agents required on compute nodes.

## What it does

* **User & Group lookups.** Implements the NSS entry points for passwd and group databases, supporting both *by name/id* and *enumeration*; returns “not found” cleanly when appropriate.  &#x20;
* **Host lookups (IPv4).** Supplies `gethostbyname_r`/`gethostbyaddr_r` with structured alias and address lists; rejects malformed queries early.  &#x20;
* **Predictable retry/timeout.** Non-blocking receives with bounded retry windows keep lookups responsive under upstream trouble. &#x20;
* **Clear error taxonomy.** Standardized error codes for socket, bind, send, timeout, credential errors, and authorization failures. &#x20;

## Highlights

* **Drop-in NSS backend.** Enable per-database with `nsswitch.conf` (e.g., `passwd`, `group`, `hosts`).&#x20;
* **Auto home-dir provisioning (optional).** Create home directories on first login via PAM.&#x20;
* **Low-overhead IPC.** Lightweight local socket exchange with caller credential passing to support policy decisions.&#x20;
* **Safe parsing.** Robust in-place decoding of colon/comma-separated payloads into `passwd`, `group`, and `hostent` structs (aliases and multiple addresses supported).  &#x20;

## Quick setup (node side)

Add H5NSS after the system backends you already trust:

```conf
# /etc/nsswitch.conf
passwd:         compat h5proxy
group:          compat h5proxy
shadow:         compat
```

Optionally provision home directories on first login:

```conf
# /etc/pam.d/common-session
session optional pam_mkhomedir.so skel=/etc/skel umask=077
```

*(That’s it for the node. Upstream configuration and policies live on your control plane.)*

## How lookups behave (at a glance)

* **`getpwnam_r` / `getpwuid_r`:** Queries upstream; on success fills all fields (uid, gid, gecos, dir, shell). Enumeration is supported via `setpwent/getpwent/endpwent`.  &#x20;
* **`getgrnam_r` / `getgrgid_r`:** Returns group name/gid and a **NULL-terminated member list**. Enumeration via `setgrent/getgrent/endgrent`. &#x20;
* **`gethostbyname_r` / `gethostbyaddr_r`:** Supplies canonical name, aliases, and one or more IPv4 addresses; rejects suspicious queries; preserves caller’s address in reverse lookups.  &#x20;

Failures return standard `NSS_STATUS_…` values (e.g., `NOTFOUND`, `UNAVAIL`, `TRYAGAIN`) with appropriate `errno`/`h_errno` set—so existing tools degrade gracefully. &#x20;

## Operational model

* **Local, bounded requests.** Lookups send a short request to a local endpoint and wait with **bounded retries and delays**—no process stalls on network hiccups. &#x20;
* **Caller credentials forwarded.** The backend includes **PID/UID/GID** with the request so the authority can enforce per-caller policies. &#x20;
* **Clear diagnostics.** Uniform status codes for transport and policy errors simplify node-side logging/alerting.&#x20;

## Compatibility

* **Linux glibc NSS** (passwd, group, hosts, shadow\*). Shadow lookups are a no-op by design unless explicitly enabled.&#x20;

## At a glance (features list)

* :material-police-badge-outline:{.icon} **Policy-aware identities** with caller credentials propagated for server-side authorization.&#x20;
* :octicons-list-ordered-16:{.icon} **Enumerations** (`getpwent`, `getgrent`) and targeted lookups (`byname`, `byid`). &#x20;
* :material-link-variant-plus:{.icon} **Hosts + aliases + multi-A** results for IPv4.&#x20;
* :material-timer-10:{.icon} **Resilient timeouts** with bounded retries (non-blocking).&#x20;
* :fontawesome-solid-droplet:{.icon} **Drop-in enablement** via `nsswitch.conf` and (optionally) PAM `pam_mkhomedir`. &#x20;

## Want to kick the tires?

Point `passwd`, `group`, and `hosts` to `h5proxy` in `nsswitch.conf`, enable home-dir provisioning if you like, and test with the usual suspects:

```bash
getent passwd alice
getent group research
getent hosts compute-01
```

If the upstream directory is down or unreachable, you’ll get prompt, well-typed errors rather than hangs.&#x20;

*H5NSS is proprietary software by Varga Consulting.*
