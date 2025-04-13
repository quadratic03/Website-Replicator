// Main JavaScript file for ID Replicator
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const urlInput = document.getElementById('url-input');
    const startReplicationBtn = document.getElementById('start-replication');
    const previewSection = document.getElementById('preview-section');
    const statusDashboard = document.getElementById('status-dashboard');
    const actionBar = document.getElementById('action-bar');
    const toggleAdvancedBtn = document.getElementById('toggle-advanced');
    const advancedContent = document.querySelector('.advanced-content');
    const originalPreview = document.getElementById('original-preview');
    const replicatedPreview = document.getElementById('replicated-preview');
    const overallProgress = document.getElementById('overall-progress');
    const progressPercentage = document.getElementById('progress-percentage');
    const logsContent = document.getElementById('logs-content');
    const componentStatuses = {
        html: document.getElementById('html-status'),
        assets: document.getElementById('assets-status'),
        database: document.getElementById('database-status'),
        scripts: document.getElementById('scripts-status')
    };

    // Toggle Advanced Settings
    toggleAdvancedBtn.addEventListener('click', function() {
        const isHidden = advancedContent.style.display === 'none';
        advancedContent.style.display = isHidden ? 'grid' : 'none';
        toggleAdvancedBtn.innerHTML = isHidden ? 
            '<i class="fas fa-chevron-up"></i>' : 
            '<i class="fas fa-chevron-down"></i>';
    });

    // Start Replication Process
    startReplicationBtn.addEventListener('click', function() {
        const url = urlInput.value.trim();
        
        if (!url) {
            addLog('Please enter a valid URL', 'error');
            return;
        }
        
        if (!isValidURL(url)) {
            addLog('Invalid URL format. Please enter a valid URL (e.g., https://example.com)', 'error');
            return;
        }
        
        // Start replication process
        startReplication(url);
    });

    // URL validation
    function isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Simulate replication process
    function startReplication(url) {
        // Show preview and status sections
        previewSection.style.display = 'block';
        statusDashboard.style.display = 'block';
        actionBar.style.display = 'flex';
        
        // Update original preview
        originalPreview.src = url;
        
        // Add initial log
        addLog(`Starting replication process for ${url}`, 'info');
        
        // Reset progress
        updateProgress(0);
        
        // Reset component statuses
        for (const component in componentStatuses) {
            updateComponentStatus(component, 'pending');
        }
        
        // Simulate HTML structure replication
        setTimeout(() => {
            updateComponentStatus('html', 'in-progress');
            addLog('Fetching HTML structure...', 'info');
            
            setTimeout(() => {
                updateComponentStatus('html', 'success');
                updateProgress(20);
                addLog('HTML structure successfully replicated', 'info');
                
                // Simulate Assets replication
                updateComponentStatus('assets', 'in-progress');
                addLog('Downloading assets (images, fonts, etc.)...', 'info');
                
                setTimeout(() => {
                    updateComponentStatus('assets', 'success');
                    updateProgress(50);
                    addLog('Assets successfully downloaded', 'info');
                    
                    // Simulate Database replication
                    updateComponentStatus('database', 'in-progress');
                    addLog('Replicating database structure...', 'info');
                    
                    setTimeout(() => {
                        updateComponentStatus('database', 'warning');
                        updateProgress(70);
                        addLog('Database partially replicated. Some tables might be restricted.', 'warning');
                        
                        // Simulate Scripts replication
                        updateComponentStatus('scripts', 'in-progress');
                        addLog('Processing JavaScript files...', 'info');
                        
                        setTimeout(() => {
                            updateComponentStatus('scripts', 'success');
                            updateProgress(100);
                            addLog('Replication process completed!', 'info');
                            
                            // Update replicated preview (in a real app, this would be the URL of the replicated site)
                            replicatedPreview.src = url;
                        }, 2000);
                    }, 2000);
                }, 3000);
            }, 2000);
        }, 1000);
    }

    // Update progress bar
    function updateProgress(percentage) {
        overallProgress.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;
    }

    // Update component status
    function updateComponentStatus(component, status) {
        const statusElement = componentStatuses[component];
        
        if (!statusElement) return;
        
        let statusHTML = '';
        
        switch (status) {
            case 'pending':
                statusHTML = '<span class="status-pending"><i class="fas fa-circle-notch fa-spin"></i> Pending</span>';
                break;
            case 'in-progress':
                statusHTML = '<span class="status-in-progress"><i class="fas fa-spinner fa-spin"></i> In Progress</span>';
                break;
            case 'success':
                statusHTML = '<span class="status-success"><i class="fas fa-check-circle"></i> Completed</span>';
                break;
            case 'warning':
                statusHTML = '<span class="status-warning"><i class="fas fa-exclamation-triangle"></i> Warning</span>';
                break;
            case 'error':
                statusHTML = '<span class="status-error"><i class="fas fa-times-circle"></i> Failed</span>';
                break;
        }
        
        statusElement.innerHTML = statusHTML;
    }

    // Add log entry
    function addLog(message, type = 'info') {
        const logItem = document.createElement('p');
        logItem.className = `log-item log-${type}`;
        logItem.innerHTML = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        logsContent.prepend(logItem);
        
        // Limit log items to 50
        if (logsContent.children.length > 50) {
            logsContent.removeChild(logsContent.lastChild);
        }
    }

    // Action buttons event listeners
    document.getElementById('download-site').addEventListener('click', function() {
        const downloadBtn = this;
        const originalBtnText = downloadBtn.innerHTML;
        
        // Change button to loading state
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
        downloadBtn.disabled = true;
        
        addLog('Preparing download package...', 'info');
        
        // Get the URL from the original preview iframe
        const url = originalPreview.src;
        
        if (url === 'about:blank') {
            addLog('No website to download. Please start replication first.', 'error');
            // Reset button
            downloadBtn.innerHTML = originalBtnText;
            downloadBtn.disabled = false;
            return;
        }
        
        // Check if options are enabled
        const downloadAssets = document.getElementById('download-assets').checked;
        const preserveCSS = document.getElementById('preserve-css').checked;
        const handleJS = document.getElementById('handle-js').checked;
        const downloadEditable = document.getElementById('download-editable').checked;
        
        // Create a temporary iframe to get the HTML content
        const tempFrame = document.createElement('iframe');
        tempFrame.style.display = 'none';
        document.body.appendChild(tempFrame);
        
        // Set a timeout in case the iframe load takes too long
        const timeoutId = setTimeout(() => {
            addLog('Request timed out. Using fallback method.', 'warning');
            handleDownloadFallback(url, downloadEditable);
            cleanup();
        }, 10000); // 10 second timeout
        
        // Function to clean up resources
        function cleanup() {
            clearTimeout(timeoutId);
            if (document.body.contains(tempFrame)) {
                document.body.removeChild(tempFrame);
            }
            // Reset button
            downloadBtn.innerHTML = originalBtnText;
            downloadBtn.disabled = false;
        }
        
        // Fallback download method for CORS issues
        function handleDownloadFallback(url, editable) {
            try {
                const urlObj = new URL(url);
                const domain = urlObj.hostname.replace(/\./g, '-');
                
                // Basic template representing the original site (fallback when actual content can't be accessed)
                const basicContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${urlObj.hostname}</title>
    <meta name="generator" content="ID Replicator - Website Cloning Tool">
    <!-- Original site: ${url} -->
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        header {
            margin-bottom: 30px;
        }
        h1 {
            color: #333;
        }
        .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .replication-note {
            background-color: #f8f9fa;
            border-left: 4px solid #4a6cf7;
            padding: 10px;
            margin: 20px 0;
            font-size: 0.9em;
            color: #6c757d;
        }
        footer {
            margin-top: 30px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            font-size: 0.8em;
            color: #777;
        }
    </style>
</head>
<body>
    <header>
        <div class="replication-note">
            <p>This is a replication of <a href="${url}">${url}</a></p>
            <p>Replicated with ID Replicator on ${new Date().toLocaleString()}</p>
        </div>
    </header>
    <main>
        <h1>${urlObj.hostname}</h1>
        <div class="content">
            <p>This is a basic replication of the original website.</p>
            <p>The original content could not be accessed directly due to browser security restrictions.</p>
        </div>
    </main>
    <footer>
        <p>Generated by ID Replicator - Website Cloning Tool</p>
        <p>Developed by Namoc</p>
    </footer>
</body>
</html>`;
                
                // Create a downloadable blob with the content
                let content = basicContent;
                
                // If editable version is requested, wrap the content with editor
                if (editable) {
                    content = generateEditableWrapper(urlObj.hostname, url, basicContent);
                }
                
                // Create a downloadable blob
                const blob = new Blob([content], { type: 'text/html' });
                const downloadUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadUrl;
                
                if (editable) {
                    downloadLink.download = `${domain}-editable.html`;
                } else {
                    downloadLink.download = `${domain}-replicated.html`;
                }
                
                // Trigger the download
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(downloadUrl);
                
                if (editable) {
                    addLog('Editable version downloaded (with limitations due to CORS)', 'info');
                } else {
                    addLog('Basic HTML version downloaded due to CORS restrictions', 'info');
                }
            } catch (error) {
                addLog(`Download failed: ${error.message}`, 'error');
            }
        }
        
        tempFrame.onload = function() {
            clearTimeout(timeoutId); // Clear the timeout
            
            try {
                // Get the HTML content from the iframe
                let content = '';
                try {
                    const doc = tempFrame.contentDocument;
                    
                    // If we can access the content and download assets is enabled
                    if (downloadAssets) {
                        // Handle CSS files if preserve CSS is enabled
                        if (preserveCSS) {
                            const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
                            stylesheets.forEach(stylesheet => {
                                try {
                                    // Create inline style instead of linked stylesheet
                                    const styleElement = doc.createElement('style');
                                    styleElement.textContent = `/* CSS from ${stylesheet.href} */
/* This is a placeholder for the external CSS. In a full implementation, 
the actual CSS would be fetched and embedded here. */`;
                                    stylesheet.parentNode.replaceChild(styleElement, stylesheet);
                                } catch (e) {
                                    // If we can't process a stylesheet, leave it as is
                                }
                            });
                        }
                        
                        // Handle script files if handle JS is enabled
                        if (handleJS) {
                            const scripts = doc.querySelectorAll('script[src]');
                            scripts.forEach(script => {
                                // Add a comment to indicate external scripts
                                const commentNode = doc.createComment(` External script from: ${script.src} `);
                                script.parentNode.insertBefore(commentNode, script);
                            });
                        }
                        
                        // Add a meta tag to indicate this is a replicated site
                        const metaTag = doc.createElement('meta');
                        metaTag.name = 'generator';
                        metaTag.content = 'ID Replicator - Website Cloning Tool';
                        doc.head.appendChild(metaTag);
                        
                        // Add a comment at the top of the HTML
                        const docType = doc.doctype ? 
                            new XMLSerializer().serializeToString(doc.doctype) : '<!DOCTYPE html>';
                        const htmlComment = `<!--
Replicated by ID Replicator - Website Cloning Tool
Original URL: ${url}
Date: ${new Date().toLocaleString()}
Developed by Namoc
-->`;
                        
                        // Get the modified HTML content
                        content = docType + '\n' + htmlComment + '\n' + doc.documentElement.outerHTML;
                    } else {
                        // Just get the unmodified HTML content
                        content = doc.documentElement.outerHTML;
                    }
                    
                    // If user wants the editable version, wrap the content with the editor
                    if (downloadEditable) {
                        const urlObj = new URL(url);
                        content = generateEditableWrapper(urlObj.hostname, url, content);
                        addLog('Creating editable version with actual website content...', 'info');
                    }
                    
                } catch (e) {
                    // If CORS prevents accessing the content directly, use a fallback
                    addLog('CORS restrictions detected. Using fallback template.', 'warning');
                    
                    if (downloadEditable) {
                        handleDownloadFallback(url, true);
                    } else {
                        handleDownloadFallback(url, false);
                    }
                    
                    cleanup();
                    return;
                }
                
                // Create a downloadable blob
                const blob = new Blob([content], { type: 'text/html' });
                const downloadUrl = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = downloadUrl;
                
                // Get domain name for the filename
                const urlObj = new URL(url);
                const domain = urlObj.hostname.replace(/\./g, '-');
                
                // Set the filename based on whether it's editable or not
                if (downloadEditable) {
                    downloadLink.download = `${domain}-editable.html`;
                } else {
                    downloadLink.download = `${domain}-replicated.html`;
                }
                
                // Trigger the download
                document.body.appendChild(downloadLink);
                downloadLink.click();
                
                // Clean up
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(downloadUrl);
                
                if (downloadEditable) {
                    addLog('Website downloaded with editing capabilities!', 'info');
                } else {
                    addLog('Website HTML code downloaded successfully!', 'info');
                }
            } catch (error) {
                addLog(`Download failed: ${error.message}`, 'error');
            } finally {
                cleanup();
            }
        };
        
        tempFrame.onerror = function() {
            clearTimeout(timeoutId);
            addLog('Failed to load the website content', 'error');
            handleDownloadFallback(url, downloadEditable);
            cleanup();
        };
        
        // Set the iframe source after all handlers are attached
        tempFrame.src = url;
    });

    // Function to generate editable HTML template
    function generateEditableHtml(siteName, siteUrl, originalContent = '') {
        return generateEditableWrapper(siteName, siteUrl, originalContent);
    }
    
    // Function to wrap website content with an editor interface
    function generateEditableWrapper(siteName, siteUrl, websiteContent = '') {
        // Escape any backticks in the website content
        const safeContent = websiteContent.replace(/`/g, '\\`');
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit: ${siteName}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            line-height: 1.6;
        }
        .site-info {
            background-color: #f5f5f5;
            border-left: 4px solid #4a6cf7;
            padding: 15px;
            margin-bottom: 20px;
        }
        .edit-tools {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        .edit-button {
            padding: 8px 12px;
            background-color: #4a6cf7;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 500;
        }
        .edit-button:hover {
            background-color: #3a59d9;
        }
        .edit-button.active {
            background-color: #28a745;
        }
        .iframe-container {
            width: 100%;
            height: 600px;
            border: 1px solid #ddd;
            position: relative;
        }
        .iframe-container iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        .editor-container {
            display: none;
            width: 100%;
            height: 600px;
            border: 1px solid #ddd;
        }
        #html-editor, #css-editor {
            width: 100%;
            height: 100%;
            font-family: monospace;
            font-size: 14px;
            padding: 10px;
            resize: none;
            tab-size: 2;
        }
        .tabs {
            display: flex;
            border-bottom: 1px solid #ddd;
        }
        .tab {
            padding: 8px 15px;
            cursor: pointer;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-bottom: none;
            margin-right: 5px;
        }
        .tab.active {
            background-color: white;
            border-bottom: 1px solid white;
            margin-bottom: -1px;
        }
        .tab-content {
            display: none;
            height: calc(100% - 37px);
        }
        .tab-content.active {
            display: block;
        }
        .save-indicator {
            color: #28a745;
            margin-left: 15px;
            display: none;
        }
        .note {
            color: #666;
            font-size: 0.9rem;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="site-info">
        <p><strong>Original URL:</strong> <a href="${siteUrl}" target="_blank">${siteUrl}</a></p>
        <p><strong>Replicated:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Developed by:</strong> Namoc</p>
    </div>
    
    <div class="edit-tools">
        <button id="toggle-edit-mode" class="edit-button">Edit Mode</button>
        <button id="apply-changes" class="edit-button" disabled>Apply Changes</button>
        <button id="save-changes" class="edit-button" disabled>Save Changes</button>
        <button id="export-html" class="edit-button">Export Pure HTML</button>
        <span id="save-indicator" class="save-indicator">Changes saved!</span>
    </div>
    
    <div id="preview-mode">
        <div class="iframe-container">
            <iframe id="site-preview" src="about:blank" sandbox="allow-same-origin allow-scripts"></iframe>
        </div>
    </div>
    
    <div id="edit-mode" class="editor-container">
        <div class="tabs">
            <div class="tab active" data-tab="html">HTML</div>
            <div class="tab" data-tab="css">CSS</div>
        </div>
        <div class="tab-content active" data-tab-content="html">
            <textarea id="html-editor" spellcheck="false" placeholder="Loading HTML content..."></textarea>
        </div>
        <div class="tab-content" data-tab-content="css">
            <textarea id="css-editor" spellcheck="false" placeholder="/* Add your custom CSS here */
body {
  /* Modify the body styles */
}

h1, h2, h3 {
  /* Modify headings */
}

/* Add more custom styles as needed */"></textarea>
        </div>
    </div>
    
    <p class="note">Note: The editor contains the actual website HTML code. You can edit it directly.</p>
    
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        // DOM Elements
        const toggleEditModeBtn = document.getElementById('toggle-edit-mode');
        const applyChangesBtn = document.getElementById('apply-changes');
        const saveChangesBtn = document.getElementById('save-changes');
        const exportHtmlBtn = document.getElementById('export-html');
        const saveIndicator = document.getElementById('save-indicator');
        const previewMode = document.getElementById('preview-mode');
        const editMode = document.getElementById('edit-mode');
        const sitePreview = document.getElementById('site-preview');
        const htmlEditor = document.getElementById('html-editor');
        const cssEditor = document.getElementById('css-editor');
        const tabs = document.querySelectorAll('.tab');
        
        // Editor state
        let editModeActive = false;
        let originalHtml = '';
        let customCss = '';
        
        // Initial HTML content - The actual website HTML
        const websiteHtml = \`${safeContent}\`;
        
        // Tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Add active class to current tab and content
                const tabName = this.getAttribute('data-tab');
                this.classList.add('active');
                document.querySelector('[data-tab-content="' + tabName + '"]').classList.add('active');
            });
        });
        
        // Toggle edit mode
        toggleEditModeBtn.addEventListener('click', function() {
            editModeActive = !editModeActive;
            
            if (editModeActive) {
                // Switch to edit mode
                previewMode.style.display = 'none';
                editMode.style.display = 'block';
                toggleEditModeBtn.classList.add('active');
                toggleEditModeBtn.textContent = 'Preview Mode';
                applyChangesBtn.disabled = false;
                saveChangesBtn.disabled = false;
                
                // Set initial content if it's the first time
                if (!originalHtml) {
                    htmlEditor.value = websiteHtml;
                    originalHtml = websiteHtml;
                }
            } else {
                // Switch to preview mode
                applyChanges(); // Apply any pending changes
                previewMode.style.display = 'block';
                editMode.style.display = 'none';
                toggleEditModeBtn.classList.remove('active');
                toggleEditModeBtn.textContent = 'Edit Mode';
            }
        });
        
        // Apply changes to preview
        applyChangesBtn.addEventListener('click', applyChanges);
        
        function applyChanges() {
            // Get the edited HTML and CSS
            const htmlContent = htmlEditor.value;
            const cssContent = cssEditor.value;
            customCss = cssContent;
            
            // Create a blob URL from the HTML content with CSS injected
            let finalHtml = htmlContent;
            
            // Check if HTML already has a style tag for custom styles
            if (finalHtml.includes('<style id="custom-styles">')) {
                finalHtml = finalHtml.replace(
                    /<style id="custom-styles">[\\s\\S]*?<\\/style>/,
                    '<style id="custom-styles">' + cssContent + '</style>'
                );
            } else {
                // If not, add it to the head
                finalHtml = finalHtml.replace(
                    '</head>',
                    '<style id="custom-styles">' + cssContent + '</style>\\n</head>'
                );
            }
            
            const blob = new Blob([finalHtml], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);
            
            // Update the preview
            sitePreview.src = blobUrl;
            
            // Clean up the old blob URL after it's loaded
            sitePreview.onload = function() {
                URL.revokeObjectURL(blobUrl);
            };
        }
        
        // Export the pure HTML (no editor interface)
        exportHtmlBtn.addEventListener('click', function() {
            const htmlContent = htmlEditor.value;
            const cssContent = cssEditor.value;
            
            // Create a final HTML with custom CSS
            let finalHtml = htmlContent;
            
            // Check if HTML already has a style tag for custom styles
            if (finalHtml.includes('<style id="custom-styles">')) {
                finalHtml = finalHtml.replace(
                    /<style id="custom-styles">[\\s\\S]*?<\\/style>/,
                    '<style id="custom-styles">' + cssContent + '</style>'
                );
            } else {
                // If not, add it to the head
                finalHtml = finalHtml.replace(
                    '</head>',
                    '<style id="custom-styles">' + cssContent + '</style>\\n</head>'
                );
            }
            
            // Create blob and download link
            const blob = new Blob([finalHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '${siteName.replace(/[^a-z0-9]/gi, '-')}-pure.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            alert('Pure HTML version exported successfully!');
        });
        
        // Save changes to local storage
        saveChangesBtn.addEventListener('click', function() {
            // Get the current HTML and CSS
            const htmlContent = htmlEditor.value;
            const cssContent = cssEditor.value;
            
            // Save to local storage
            try {
                localStorage.setItem('replicated-html-' + '${siteName.replace(/[^a-z0-9]/gi, '-')}', htmlContent);
                localStorage.setItem('replicated-css-' + '${siteName.replace(/[^a-z0-9]/gi, '-')}', cssContent);
                
                // Show saved indicator
                saveIndicator.style.display = 'inline';
                setTimeout(() => {
                    saveIndicator.style.display = 'none';
                }, 2000);
            } catch (e) {
                alert('Failed to save changes. Local storage may be full or disabled.');
            }
            
            // Also prompt to download the edited version
            promptDownload(htmlContent, cssContent);
        });
        
        // Prompt to download the edited HTML file
        function promptDownload(htmlContent, cssContent) {
            // Check if HTML already has a style tag for custom styles
            let finalHtml = htmlContent;
            
            if (finalHtml.includes('<style id="custom-styles">')) {
                finalHtml = finalHtml.replace(
                    /<style id="custom-styles">[\\s\\S]*?<\\/style>/,
                    '<style id="custom-styles">' + cssContent + '</style>'
                );
            } else {
                // If not, add it to the head
                finalHtml = finalHtml.replace(
                    '</head>',
                    '<style id="custom-styles">' + cssContent + '</style>\\n</head>'
                );
            }
            
            // Create blob and download link
            const blob = new Blob([finalHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = '${siteName.replace(/[^a-z0-9]/gi, '-')}-edited.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        // Load saved content if available
        function loadSavedContent() {
            try {
                const savedHtml = localStorage.getItem('replicated-html-' + '${siteName.replace(/[^a-z0-9]/gi, '-')}');
                const savedCss = localStorage.getItem('replicated-css-' + '${siteName.replace(/[^a-z0-9]/gi, '-')}');
                
                if (savedHtml) {
                    htmlEditor.value = savedHtml;
                    originalHtml = savedHtml;
                }
                
                if (savedCss) {
                    cssEditor.value = savedCss;
                    customCss = savedCss;
                }
            } catch (e) {
                // If local storage is unavailable, just continue
            }
        }
        
        // Initialize - Set up initial preview and load saved content
        loadSavedContent();
        
        // Initialize preview with content
        setTimeout(function() {
            if (!editModeActive) {
                applyChanges();
            }
        }, 100);
    });
    </script>
</body>
</html>`;
    }
    
    // Function to generate basic HTML template when CORS prevents direct access
    function generateBasicHtml(siteName, siteUrl) {
        // Use the editable template for all downloads
        return generateEditableHtml(siteName, siteUrl);
    }

    document.getElementById('share-site').addEventListener('click', function() {
        const dummyURL = 'https://id-replicator.example/site/12345';
        navigator.clipboard.writeText(dummyURL)
            .then(() => {
                addLog(`Site URL copied to clipboard: ${dummyURL}`, 'info');
            })
            .catch(err => {
                addLog('Failed to copy URL to clipboard', 'error');
            });
    });

    document.getElementById('save-config').addEventListener('click', function() {
        addLog('Configuration saved successfully', 'info');
    });

    document.getElementById('cancel-operation').addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel the current operation? All progress will be lost.')) {
            previewSection.style.display = 'none';
            statusDashboard.style.display = 'none';
            actionBar.style.display = 'none';
            addLog('Operation cancelled by user', 'warning');
        }
    });

    // Update resource usage periodically (simulated)
    setInterval(() => {
        document.getElementById('cpu-usage').textContent = `${Math.floor(Math.random() * 25) + 5}%`;
        document.getElementById('memory-usage').textContent = `${Math.floor(Math.random() * 300) + 200}MB`;
    }, 5000);
}); 