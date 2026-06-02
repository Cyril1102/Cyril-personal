# Building baixi.xyz from Scratch: Notes from a First Launch

> 2026.05.23  
> A step-by-step record of buying a server, registering a domain, setting up DNS, opening ports, deploying the site, enabling HTTPS, and finishing ICP filing.

On May 22, 2026, I bought my first cloud server. By the next day, May 23, **baixi.xyz** was already live.

It all happened in less than twenty-four hours, with plenty of mistakes along the way. If you want a site of your own, this record might help you avoid a few of them.

---

## The Path of a Request

What happens between typing a domain and seeing a page?

```
You enter a domain → DNS (domain to IP) → Firewall (ports 80/443) → Nginx (web server) → HTML/CSS/JS → HTTPS → ICP filing → Browser
```

---

## Step 1: Buy a Server

### What I Chose

| Item | Choice |
|------|------|
| Cloud provider | Tencent Cloud |
| Product | CVM cloud server (Standard S5) |
| Instance | S5.LARGE4 — 4 vCPU / 4 GB RAM |
| Disk | 40 GB SSD cloud disk |
| Region / zone | Shanghai (`ap-shanghai`) |
| Operating system | Ubuntu 24.04 LTS |
| Public IP | 124.220.6.3 |
| Created | May 22, 2026, 16:54 |

### What a Server Really Is

A server is simply a computer that stays on all the time. Mine sits in Tencent Cloud's infrastructure. I upload site files there, and when someone opens the domain, that machine sends the page back.

Without the server, there is nowhere for the site to live.

### CVM vs. the Lightweight Server Option

Tencent Cloud offers both:

- **Lightweight Application Server**: simpler packaged plans, usually better for beginners.
- **CVM**: more flexible, with CPU, memory, and storage configured separately.

I chose CVM because it gave me more room to adjust later.

### Why Linux Instead of Windows

Linux is still the default environment for this kind of work. It is stable, well documented, and easier to run a web stack on. Ubuntu felt like the most practical place to start.

---

## Step 2: Buy a Domain

### My Domain

| Item | Choice |
|------|------|
| Domain | baixi.xyz |
| Registrar | Tencent Cloud |
| Extension | .xyz |

### What a Domain Does

A domain is the memorable name for a numeric server address. My server has an IP address, `124.220.6.3`, but that is not how people want to reach a site.

The domain gives that address a name people can remember.

### Why I Picked .xyz

- Most short `.com` names I liked were already taken
- `.cn` came with extra constraints and higher cost
- `.xyz` looked clean, stayed affordable, and worked globally

---

## Step 3: Configure DNS

> This was the part that took me the longest to understand.

### DNS Connects the Domain to the Server

Buying the domain only gives you the name. It still needs to know where the server is.

DNS is the layer that tells the internet:

**`www.baixi.xyz` → `124.220.6.3`**

I used **DNSPod**, Tencent Cloud's DNS service.

### There Were Two Required Steps

#### 1. Add the A records in DNSPod

| Record type | Host | Value | Purpose |
|----------|----------|--------|------|
| A | www | 124.220.6.3 | `www.baixi.xyz` → server |
| A | @ | 124.220.6.3 | `baixi.xyz` → server |

An A record is the most basic DNS record: it points a domain name to an IP address.

#### 2. Change the nameservers

The domain did not use DNSPod by default. I had to go into the registrar settings and switch the nameservers to:

```text
sarah.dnspod.net
bear.dnspod.net
```

That was my first real pitfall. I had already added the A records, but nothing worked because the domain was still listening somewhere else.

### How Long Did It Take?

DNS propagation can take anywhere from one to forty-eight hours worldwide. Mine settled in a little over an hour.

---

## Step 4: Open the Firewall Ports

Tencent Cloud servers start locked down by default, which is good for security and terrible for a website no one can reach.

### Ports Are the Doors

```text
Server
├── 80   HTTP
├── 443  HTTPS
├── 22   SSH
└── everything else closed
```

In the security group, I added:

| Protocol | Port | Source | Purpose |
|------|------|------|------|
| TCP | 80 | 0.0.0.0/0 | HTTP |
| TCP | 443 | 0.0.0.0/0 | HTTPS |

If those ports stay closed, the server can be configured perfectly and still remain unreachable.

---

## Step 5: Install Nginx

### Nginx Is the Web Server

Nginx is the layer that serves the site. When someone visits, it decides which files to return.

In practice, it needed to know:

- which domain to respond to
- where the files were stored
- which file should act as the homepage

Without that configuration, the files exist, but the server does not know what to do with them.

---

## Step 6: Build the Page

The site files live in `/var/www/html/`, with `index.html` as the entry point.

### HTML and CSS

- **HTML** gives the page its structure
- **CSS** controls layout, typography, color, spacing, and motion

That was the part that actually turned infrastructure into a website.

---

## Step 7: Enable HTTPS

### HTTP vs HTTPS

| | HTTP | HTTPS |
|------|------|------|
| Transmission | Plain text | Encrypted |
| Safety | Exposed in transit | Protected in transit |
| Browser treatment | Marked as insecure | Trusted with a lock icon |

HTTPS matters because browsers now treat plain HTTP as something users should avoid.

### Getting the Certificate

I used **Let's Encrypt** and **Certbot**:

```bash
certbot --nginx -d www.baixi.xyz -d baixi.xyz
```

That command handled domain verification, certificate issuance, and Nginx updates in one pass.

For renewal:

```bash
0 3 * * * certbot renew --quiet --renew-hook 'systemctl reload nginx'
```

### Two Problems I Hit Here

1. A **401 error** in Certbot because I confused Tencent Cloud credentials with a DNSPod API token.
2. A broken HTTP path because Certbot overwrote my redirect rules and I had to check the Nginx config again.

---

## Step 8: ICP Filing

### Why Filing Matters

If your server is in mainland China, the site needs **ICP filing** to be accessed normally there.

This is not a technical layer in the same sense as DNS or HTTPS. It is a compliance requirement. Without it, local carriers may block access even if the infrastructure is working fine.

### Filing Steps

| Step | What I did | Time |
|------|------|------|
| 1 | Logged into Tencent Cloud filing system | 2 min |
| 2 | Filled in personal information | 5 min |
| 3 | Filled in site information | 5 min |
| 4 | Uploaded ID photos | 2 min |
| 5 | Completed face verification | 1 min |
| 6 | Tencent Cloud initial review | 1–2 business days |
| 7 | Government review | 3–20 business days |
| 8 | Filing number issued | Done |

### One Practical Note

It is worth starting the filing process early. Everything else moves faster, and this is the part that can hold the timeline up the longest.

---

## Cost Summary

| Item | Cost | Cycle |
|------|------|------|
| CVM S5.LARGE4 (4 vCPU / 4 GB / 40 GB SSD) | RMB 135 | 1 year |
| Domain `baixi.xyz` | RMB 70 | 1 year |
| DNSPod | Free | Ongoing |
| DeepSeek API credit | RMB 20 | Usage-based |
| Nginx | Free | Open source |
| SSL certificate | Free | Auto-renewed |
| ICP filing | Free | Ongoing |

### First-Year Total: RMB 225

The following year should be a little cheaper, mostly just the server and domain renewal.

---

## Common Pitfalls

| # | Problem | Symptom | Cause | Fix |
|---|------|------|------|------|
| 1 | Domain still did not open | “Page not found” | Nameservers were not switched to DNSPod | Change the nameservers first |
| 2 | Ports were closed | Connection timeout | Security group missing 80/443 | Open the ports early |
| 3 | Certbot returned 401 | Certificate request failed | Wrong credentials used | Create a separate DNSPod token |
| 4 | HTTP turned into 404 | The site stopped opening | Redirect rules were overwritten | Recheck Nginx after certificate setup |
| 5 | Site unreachable in mainland China | Access blocked | ICP filing not finished | Start filing as soon as the server is ready |
| 6 | NS records looked inactive | `dig` returned nothing | Nameserver change still propagating | Wait and check again |

---

## Build Flow

```text
Buy CVM → Buy domain → Add A record → Change DNS → Open ports
        ↓
Install Nginx → Deploy site → Enable SSL → Submit filing → Done
```

---

> 2026.05.23, Shanghai  
> CVM S5.LARGE4 · 4 vCPU / 4 GB RAM · Ubuntu 24.04 · Filing in progress
