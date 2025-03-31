import SkillSlider from './SkillSlider';

export default function SkillList({ skills, onSlide, onMedal }) {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto">
      {skills.map((skill, index) => (
        <SkillSlider
          key={index}
          skill={skill}
          index={index}
          onSlide={onSlide}
          onMedal={onMedal}
        />
      ))}
    </div>
  );
}