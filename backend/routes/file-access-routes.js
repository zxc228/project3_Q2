const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

/**
 * serving protected file with authentication check. the users' files are now to be stored in a private location on the server and be accessible with correct permissions
 * GET /api/files/:type/:filename
 */
module.exports = function(services) {
  router.get('/:type/:filename', async (req, res, next) => {
    try {
      const { type, filename } = req.params;
      const user = req.user; // From auth middleware
      
      // validating file type
      const validTypes = ['academic_records', 'cvs', 'reports'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid file type' });
      }
      
      // preventing path traversal attacks (this part was suggested to me by Claude, and after some reading I decided to leave this)
      const sanitizedFilename = path.basename(filename);
      
      // determining file path
      const filePath = path.join(process.cwd(), 'private', 'uploads', type, sanitizedFilename);
      
      // checking if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
      }
      
      // authorization check - who can access what
      if (type === 'academic_records' || type === 'cvs') {
        // getting file URL as stored in the database
        const fileUrl = `/api/files/${type}/${sanitizedFilename}`;

        // getting profile associated with file
        const profileId = await services.profileService.getProfileIdByFilePath(fileUrl);
        
        // only allow if: 
        // 1. User is accessing their own file
        // 2. User is an admin
        // 3. User is a teacher and is the tutor for this student
        const isOwner = user.role === 'STUDENT' && await services.profileService.isUserProfile(user.id, profileId);
        const isAdmin = user.role === 'ADMIN';
        const isAssignedTutor = user.role === 'TEACHER' && await services.tutorService.isTutorForStudent(user.id, profileId);
        
        if (!isOwner && !isAdmin && !isAssignedTutor) {
          return res.status(403).json({ error: 'Access denied' });
        }
      }
      
      // determining mime type of the file
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.pdf': 'application/pdf',
        '.html': 'text/html',
        '.htm': 'text/html',
        '.xls': 'application/vnd.ms-excel', // for the tables just in case, bc Expediente Academico can also be in a table format
        '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
      
      // sending file with appropriate content type
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.setHeader('Content-Disposition', `inline; filename="${sanitizedFilename}"`);
      
      // streaming file to response
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      next(error);
    }
  });

  return router;
};