# Beginner's Bug Hunting Journey: A Clickjacking Write-up for fusionauth.com
 
 This document details my process for identifying and reporting a clickjacking vulnerability on `fusionauth.com` as part of my journey into bug bounty hunting.
 This write-up is for educational purposes and to showcase my methodology. All sensitive information has been removed.
 
 ## 1. Reconnaissance: The First Step
 
 My process began with basic reconnaissance to understand the target's web infrastructure.
 
 ### Port Scanning
   
   I started with an `nmap` scan to identify open ports on the target server.

  Nmap scan result
  PORT    STATE SERVICE
  80/tcp  open  http
  443/tcp open  https


 
 This confirmed that the standard HTTP and HTTPS ports were open.
 
 ### Web Server Vulnerability Scanning
 
 Next, I used `nikto` to perform a web server vulnerability scan. This tool checks for common misconfigurations and known vulnerabilities. The most significant
     finding from the `nikto` scan was:

  ## 1. The anti-clickjacking X-Frame-Options header is not present.

  
 This immediately caught my attention, as the absence of this header is a primary indicator of a potential clickjacking vulnerability.
 
  ## 2. Vulnerability Analysis: Clickjacking
  
  Clickjacking, also known as UI redressing, is a vulnerability where an attacker uses multiple transparent or opaque layers to trick a user into clicking on a
  button or link on another page when they were intending to click on the top-level page.
  
  The missing `X-Frame-Options` header meant that I could likely embed `fusionauth.com` in an `iframe` on a malicious page.
 
  ## 3. Proof of Concept: Demonstrating the Impact
  
  To demonstrate the vulnerability, I created a simple HTML file (`inframe-attack.html`) that embedded a sensitive part of `fusionauth.com` in an `iframe`.
  
  The proof-of-concept code looked something like this:
  <!OCTYPE html>
  <html>
    <head><title>Clickjacking PoC</title></head>
    <body>
      <h1>Clickjacking Proof of Concept</h1>
      <p>The content below is from fusionauth.com and is embedded in an iframe.</p>
      <iframe src="https://www.fusionauth.com/[sensitive-page]" width="800" height="600"></iframe>
    </body>
  </html>


 
 This simple PoC successfully demonstrated that the website could be framed, and therefore, a malicious actor could potentially trick users into performing
 unintended actions.
 
  ## 4. Reporting
 
 After confirming the vulnerability, I compiled a detailed report that included:
 
 *   A summary of the vulnerability.
 *   The steps to reproduce it, including the proof-of-concept code.
   *   The potential impact of the vulnerability.
   *   Recommendations for remediation (i.e., implementing the `X-Frame-Options` or `Content-Security-Policy` header).
   
   I submitted this report through the Bugcrowd platform, following their responsible disclosure guidelines.
   
  ## 5. Lessons Learned
   
   This experience was a valuable lesson in the importance of:
   
   *   **Thorough Reconnaissance:** Simple tools like `nmap` and `nikto` can provide crucial starting points.
   *   **Understanding Web Fundamentals:** Knowing about HTTP headers like `X-Frame-Options` is essential for identifying common web vulnerabilities.
   *   **Clear and Concise Reporting:** A well-written report with a clear proof-of-concept is key to helping the security team understand and fix the issue.
   
   As a beginner in bug hunting, this was a great first find and a fantastic learning experience.
