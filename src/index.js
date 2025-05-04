import  Report from './report.js'

const report = {
    degree: 'BS Computer Science (Data)',
    year: '2025 (Year 3)',
    portfolio: null,
    description: 'my name jeff',
    languages: [{ name: 'english', level: 'C2' }, { name: 'Spanish', level: 'B2'} ],
    skills: ['javascript', 'css', 'eating', 'HTML'],
    experience: [
        { title: 'Job 1', institution: 'Couch Potato Inc', duration: 'string duration?', desc: 'watch tv eat chips' },
        { title: 'Job 2', institution: 'Dad Bod Corp', duration: 'string duration?', desc: 'watch tv drink beer' },
    ],
    courses: [
        { title: 'INSOEOJ', institution: 'U-Taddler', duration: 'too long', desc: 'I chose the wrong skewl' },
    ],
    careerTracks: [
        { 
            title: 'DATA ANALIST',
            desc: 'lorem ipsum, homo homini lupus, vini vidi vici', 
            skills: [ 
                { name: 'Data Mining', currentLevel: 5, desiredLevel: 5 }, 
                { name: 'Python', currentLevel: 3, desiredLevel: 3 }
            ]
        },
        { 
            title: 'VIDEO GAMER',
            desc: 'lorem ipsum, homo homini lupus, vini vidi vici', 
            skills: [ 
                { name: 'Unity', currentLevel: 3, desiredLevel: 3 },
                { name: 'Unreal Engine', currentLevel: 3, desiredLevel: 3 },
                { name: 'Python', currentLevel: 3, desiredLevel: 3 }
            ]
        }
    ]
}

;(async () => {
    const r = await Report.init('./assets/template.html', './assets/careertracks_template.html', './assets/Montserrat-Regular.ttf')
    //await r.speedTest(2000, report)
    await r.genCareerTracksReport({ careerTracks: report.careerTracks }, 'careertracks.pdf')
    await r.genReport(report, 'report.pdf')
    await r.close()
})()

