import { useState } from 'react';
import { Link } from 'react-router-dom';
import './DrawerPage.css';

interface Participant {
  id: string;
  name: string;
}

interface Winner {
  name: string;
  position: number;
}

interface Team {
  name: string;
  members: string[];
  position: number;
}

type DrawMode = 'names' | 'teams';

const DrawerPage = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newName, setNewName] = useState('');
  const [drawMode, setDrawMode] = useState<DrawMode>('names');
  const [drawCount, setDrawCount] = useState(1);
  const [teamCount, setTeamCount] = useState(2);
  const [membersPerTeam, setMembersPerTeam] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentSpin, setCurrentSpin] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const addParticipant = () => {
    if (newName.trim()) {
      // Verifica se há vírgulas para adicionar múltiplos nomes
      if (newName.includes(',')) {
        const names = newName
          .split(',')
          .map(name => name.trim())
          .filter(name => name.length > 0);
        
        const newParticipants = names.map((name, index) => ({
          id: `${Date.now()}-${index}`,
          name: name
        }));
        
        setParticipants([...participants, ...newParticipants]);
      } else {
        // Adiciona apenas um nome
        setParticipants([
          ...participants,
          { id: Date.now().toString(), name: newName.trim() }
        ]);
      }
      setNewName('');
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addParticipant();
    }
  };

  const startDraw = () => {
    if (participants.length === 0) {
      alert('Adicione pelo menos um participante!');
      return;
    }

    // Remove o foco de qualquer input
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    if (drawMode === 'names') {
      if (drawCount > participants.length) {
        alert('Número de sorteios maior que o número de participantes!');
        return;
      }

      setIsDrawing(true);
      setWinners([]);
      setTeams([]);
      setShowConfetti(false);

      const availableParticipants = [...participants];
      const selectedWinners: Winner[] = [];
      let currentPosition = 1;

      const drawNext = (index: number) => {
        if (index >= drawCount) {
          setIsDrawing(false);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          return;
        }

        // Animação de spinning
        let spinCount = 0;
        const spinInterval = setInterval(() => {
          const randomIndex = Math.floor(Math.random() * availableParticipants.length);
          setCurrentSpin(availableParticipants[randomIndex].name);
          spinCount++;

          if (spinCount > 30) {
            clearInterval(spinInterval);
            
            // Selecionar vencedor
            const winnerIndex = Math.floor(Math.random() * availableParticipants.length);
            const winner = availableParticipants[winnerIndex];
            
            selectedWinners.push({
              name: winner.name,
              position: currentPosition++
            });
            
            setWinners([...selectedWinners]);
            setCurrentSpin('');
            
            // Remover vencedor dos disponíveis
            availableParticipants.splice(winnerIndex, 1);
            
            // Aguardar antes do próximo sorteio
            setTimeout(() => drawNext(index + 1), 1000);
          }
        }, 50);
      };

      drawNext(0);
    } else {
      // Modo Times
      const totalNeeded = teamCount * membersPerTeam;
      if (totalNeeded > participants.length) {
        alert(`Você precisa de ${totalNeeded} participantes para formar ${teamCount} times com ${membersPerTeam} membros cada!`);
        return;
      }

      setIsDrawing(true);
      setWinners([]);
      setTeams([]);
      setShowConfetti(false);

      const availableParticipants = [...participants];
      const selectedTeams: Team[] = [];

      // Embaralhar participantes
      for (let i = availableParticipants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [availableParticipants[i], availableParticipants[j]] = [availableParticipants[j], availableParticipants[i]];
      }

      const drawNextTeam = (teamIndex: number) => {
        if (teamIndex >= teamCount) {
          setIsDrawing(false);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
          return;
        }

        // Animação de spinning
        let spinCount = 0;
        const spinInterval = setInterval(() => {
          setCurrentSpin(`Time ${teamIndex + 1}...`);
          spinCount++;

          if (spinCount > 20) {
            clearInterval(spinInterval);
            
            // Selecionar membros do time
            const teamMembers: string[] = [];
            for (let i = 0; i < membersPerTeam && availableParticipants.length > 0; i++) {
              const memberIndex = Math.floor(Math.random() * availableParticipants.length);
              teamMembers.push(availableParticipants[memberIndex].name);
              availableParticipants.splice(memberIndex, 1);
            }
            
            selectedTeams.push({
              name: `Time ${teamIndex + 1}`,
              members: teamMembers,
              position: teamIndex + 1
            });
            
            setTeams([...selectedTeams]);
            setCurrentSpin('');
            
            // Aguardar antes do próximo time
            setTimeout(() => drawNextTeam(teamIndex + 1), 1000);
          }
        }, 50);
      };

      drawNextTeam(0);
    }
  };

  const reset = () => {
    setWinners([]);
    setTeams([]);
    setShowConfetti(false);
    setCurrentSpin('');
  };

  const clearAll = () => {
    if (confirm('Tem certeza que deseja limpar todos os participantes?')) {
      setParticipants([]);
      setWinners([]);
      setTeams([]);
      setShowConfetti(false);
      setCurrentSpin('');
    }
  };

  return (
    <div className="drawer-page">
      <Link to="/" className="back-button">
        ← Voltar para o Portfólio
      </Link>

      <div className="drawer-container">
        <header className="drawer-header">
          <h1 className="drawer-title">
            🎲 Sorteador de Nomes
          </h1>
          <p className="drawer-subtitle">
            Adicione os participantes e deixe a sorte decidir!
          </p>
        </header>

        <div className="drawer-content">
          {/* Seção de Entrada */}
          <div className="input-section">
            <div className="input-group">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite um nome ou vários separados por vírgula..."
                className="name-input"
                disabled={isDrawing}
              />
              <button
                onClick={addParticipant}
                className="add-button"
                disabled={isDrawing || !newName.trim()}
              >
                Adicionar
              </button>
            </div>
            <div className="input-hint">
              💡 Dica: Separe nomes por vírgula para adicionar vários de uma vez
            </div>

            {/* Seletor de Modo */}
            <div className="mode-selector">
              <button
                className={`mode-button ${drawMode === 'names' ? 'active' : ''}`}
                onClick={() => setDrawMode('names')}
                disabled={isDrawing}
              >
                <span className="mode-icon">🎲</span>
                <span className="mode-text">Sortear Nomes</span>
              </button>
              <button
                className={`mode-button ${drawMode === 'teams' ? 'active' : ''}`}
                onClick={() => setDrawMode('teams')}
                disabled={isDrawing}
              >
                <span className="mode-icon">👥</span>
                <span className="mode-text">Sortear Times</span>
              </button>
            </div>

            {/* Controles de Sorteio - Nomes */}
            {drawMode === 'names' && (
              <div className="draw-controls">
                <div className="draw-controls-content">
                  <span className="draw-icon">🎯</span>
                  <label htmlFor="drawCount" className="draw-label">
                    Quantos nomes sortear?
                  </label>
                  <div className="draw-input-wrapper">
                    <button
                      className="draw-counter-btn"
                      onClick={() => setDrawCount(Math.max(1, drawCount - 1))}
                      disabled={isDrawing || drawCount <= 1}
                    >
                      −
                    </button>
                    <input
                      id="drawCount"
                      type="number"
                      min="1"
                      max={participants.length || 1}
                      value={drawCount}
                      onChange={(e) => setDrawCount(Math.min(participants.length || 1, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="draw-count-input"
                      disabled={isDrawing}
                    />
                    <button
                      className="draw-counter-btn"
                      onClick={() => setDrawCount(Math.min(participants.length || 1, drawCount + 1))}
                      disabled={isDrawing || drawCount >= (participants.length || 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="draw-hint">
                    {participants.length > 0 
                      ? `(Máx: ${participants.length})`
                      : '(Adicione participantes primeiro)'
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Controles de Sorteio - Times */}
            {drawMode === 'teams' && (
              <div className="draw-controls teams">
                <div className="draw-controls-content">
                  <span className="draw-icon">👥</span>
                  <label className="draw-label">
                    Configuração dos Times
                  </label>
                  
                  <div className="teams-config">
                    <div className="team-control">
                      <label htmlFor="teamCount" className="team-control-label">
                        Número de times:
                      </label>
                      <div className="draw-input-wrapper">
                        <button
                          className="draw-counter-btn"
                          onClick={() => setTeamCount(Math.max(2, teamCount - 1))}
                          disabled={isDrawing || teamCount <= 2}
                        >
                          −
                        </button>
                        <input
                          id="teamCount"
                          type="number"
                          min="2"
                          max={Math.floor(participants.length / 2) || 2}
                          value={teamCount}
                          onChange={(e) => setTeamCount(Math.max(2, parseInt(e.target.value) || 2))}
                          className="draw-count-input"
                          disabled={isDrawing}
                        />
                        <button
                          className="draw-counter-btn"
                          onClick={() => setTeamCount(teamCount + 1)}
                          disabled={isDrawing}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="team-control">
                      <label htmlFor="membersPerTeam" className="team-control-label">
                        Membros por time:
                      </label>
                      <div className="draw-input-wrapper">
                        <button
                          className="draw-counter-btn"
                          onClick={() => setMembersPerTeam(Math.max(1, membersPerTeam - 1))}
                          disabled={isDrawing || membersPerTeam <= 1}
                        >
                          −
                        </button>
                        <input
                          id="membersPerTeam"
                          type="number"
                          min="1"
                          value={membersPerTeam}
                          onChange={(e) => setMembersPerTeam(Math.max(1, parseInt(e.target.value) || 1))}
                          className="draw-count-input"
                          disabled={isDrawing}
                        />
                        <button
                          className="draw-counter-btn"
                          onClick={() => setMembersPerTeam(membersPerTeam + 1)}
                          disabled={isDrawing}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <span className="draw-hint">
                    {participants.length > 0 
                      ? `Necessário: ${teamCount * membersPerTeam} participantes | Disponível: ${participants.length}`
                      : '(Adicione participantes primeiro)'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Lista de Participantes */}
          <div className="participants-section">
            <div className="section-header">
              <h2>Participantes ({participants.length})</h2>
              {participants.length > 0 && (
                <button onClick={clearAll} className="clear-button" disabled={isDrawing}>
                  Limpar Todos
                </button>
              )}
            </div>

            {participants.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📝</span>
                <p>Nenhum participante adicionado ainda</p>
              </div>
            ) : (
              <div className="participants-list">
                {participants.map((participant) => (
                  <div key={participant.id} className="participant-card">
                    <span className="participant-name">{participant.name}</span>
                    <button
                      onClick={() => removeParticipant(participant.id)}
                      className="remove-button"
                      disabled={isDrawing}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Área de Sorteio */}
          <div className="draw-section">
            {isDrawing || currentSpin ? (
              <div className="spinning-wheel">
                <div className="wheel-content">
                  <span className="spinning-icon">🎰</span>
                  <h3 className="spinning-text">{currentSpin || 'Sorteando...'}</h3>
                </div>
              </div>
            ) : winners.length > 0 ? (
              <div className="winners-section">
                <h2 className="winners-title">
                  🎉 {winners.length > 1 ? 'Vencedores' : 'Vencedor'}
                </h2>
                <div className="winners-list">
                  {winners.map((winner, index) => (
                    <div key={index} className="winner-card">
                      <span className="winner-position">
                        {winner.position === 1 ? '🥇' : winner.position === 2 ? '🥈' : winner.position === 3 ? '🥉' : `${winner.position}º`}
                      </span>
                      <span className="winner-name">{winner.name}</span>
                    </div>
                  ))}
                </div>
                <button onClick={reset} className="reset-button">
                  Novo Sorteio
                </button>
              </div>
            ) : teams.length > 0 ? (
              <div className="winners-section">
                <h2 className="winners-title">
                  🎉 Times Formados
                </h2>
                <div className="teams-list">
                  {teams.map((team, index) => (
                    <div key={index} className="team-card">
                      <div className="team-header">
                        <span className="team-icon">
                          {team.position === 1 ? '🥇' : team.position === 2 ? '🥈' : team.position === 3 ? '🥉' : '⭐'}
                        </span>
                        <span className="team-name">{team.name}</span>
                      </div>
                      <div className="team-members">
                        {team.members.map((member, memberIndex) => (
                          <div key={memberIndex} className="team-member">
                            <span className="member-number">{memberIndex + 1}</span>
                            <span className="member-name">{member}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={reset} className="reset-button">
                  Novo Sorteio
                </button>
              </div>
            ) : (
              <button
                onClick={startDraw}
                className="draw-button"
                disabled={participants.length === 0 || isDrawing}
              >
                <span className="draw-button-icon">🎲</span>
                Sortear Agora!
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: `hsl(${Math.random() * 360}, 70%, 60%)`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DrawerPage;
