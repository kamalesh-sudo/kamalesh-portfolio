 ---




 # Bug Bounty Case Study: Security Assessment of TheFork.com
 
 **Objective:** To document my security assessment process on the `thefork.com` program as a beginner bug bounty hunter. This write-up is for educational and portfolio purposes, and all sensitive details have been omitted.
 
 ---
 
 ### Phase 1: Initial Reconnaissance & Automated Scanning
 
 My first step was to understand the target's attack surface.
 
 1.  **Port Scanning (`nmap`):** A basic `nmap` scan revealed the expected open ports for a web application: `80 (HTTP)` and `443 (HTTPS)`.
 
 2.  **Web Vulnerability Scanning (`nikto`):** I then ran a `nikto` scan to check for common web server misconfigurations. The scan produced a lot of output, but one finding stood out as immediately actionable:
     *   **`The anti-clickjacking X-Frame-Options header is not present.`**
 
 This indicated that the website was likely vulnerable to UI Redressal (Clickjacking) attacks.
 
 ---
 
 ### Phase 2: Manual Vulnerability Identification & PoC
 
 Based on the initial scan, I focused on manually verifying the findings and exploring other potential issues.
 
 #### Vulnerability 1: Clickjacking (UI Redressal)
 
 The missing `X-Frame-Options` header meant I could embed `thefork.com` within an `<iframe>` on an external, malicious website.
 
 *   **Proof of Concept (PoC):** I created an HTML file (`inframe-attack.html`) to demonstrate the impact. My PoC went a step further than just framing the page; it showed how a malicious site could force a user's browser to send a crafted request to one of the site's analytics endpoints (`amplitude-analytics`). This demonstrated a tangible, albeit low-severity, way to abuse the lack of protection.
 
 *   **Remediation:** The recommended fix was to implement the `X-Frame-Options: DENY` or `X-Frame-Options: SAMEORIGIN` HTTP header to prevent the site from being framed by external domains.
 
 #### Vulnerability 2: Exposed API Key
 
 During my analysis of the client-side code, I identified a hardcoded API key.
 
 *   **Impact:** While the key appeared to have limited permissions, exposing any API key on the client side is a security risk. It could potentially be abused by attackers to make unauthorized requests to the API, leading to data leakage or other unintended consequences.
 
 *   **Remediation:** The recommendation was to move the API key to the server-side and use a proxy endpoint to make requests, or to implement stricter scoping and monitoring for the client-side key.
 
 #### Vulnerability 3: Lack of Rate Limiting on GraphQL Endpoint
 
 Further investigation revealed a GraphQL endpoint that lacked proper rate limiting.
 
 *   **Impact:** This could allow an attacker to perform resource-intensive queries in rapid succession, potentially leading to a Denial of Service (DoS) attack. It could also be used to enumerate data from the API more easily than intended.
 
 *   **Remediation:** The solution was to implement rate limiting on the GraphQL endpoint, blocking IPs that make an excessive number of requests in a short period.
 
 ---
 
 ### Summary & Lessons Learned
 
 This engagement was a fantastic learning experience. My key takeaways were:
 
 *   **Layered Approach:** Combining automated scanning with manual verification is highly effective. Automated tools point you in the right direction, but manual testing is required to confirm and understand the true impact.
 *   **Beyond the Obvious:** After finding the initial low-hanging fruit (Clickjacking), it was valuable to keep digging, which led to the discovery of the API key and rate-limiting issues.
 *   **Responsible Disclosure:** All findings were documented in detailed reports and submitted via the Bugcrowd platform, following responsible disclosure protocols.
 
 This project solidified my understanding of several common web vulnerabilities and reinforced the importance of a methodical testing process.
