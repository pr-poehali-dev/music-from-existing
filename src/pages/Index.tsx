import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Track {
  id: number;
  name: string;
  volume: number;
  pan: number;
  muted: boolean;
  solo: boolean;
  color: string;
}

interface Effect {
  id: string;
  name: string;
  icon: string;
  active: boolean;
}

const Index = () => {
  const [tracks, setTracks] = useState<Track[]>([
    { id: 1, name: 'Kick', volume: 75, pan: 50, muted: false, solo: false, color: '#0EA5E9' },
    { id: 2, name: 'Snare', volume: 65, pan: 50, muted: false, solo: false, color: '#8B5CF6' },
    { id: 3, name: 'Hi-Hat', volume: 55, pan: 60, muted: false, solo: false, color: '#F97316' },
    { id: 4, name: 'Bass', volume: 80, pan: 50, muted: false, solo: false, color: '#0EA5E9' },
    { id: 5, name: 'Synth', volume: 70, pan: 45, muted: false, solo: false, color: '#8B5CF6' },
    { id: 6, name: 'Vocals', volume: 85, pan: 50, muted: false, solo: false, color: '#F97316' },
  ]);

  const [masterVolume, setMasterVolume] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [effects, setEffects] = useState<Effect[]>([
    { id: 'eq', name: 'EQ', icon: 'SlidersHorizontal', active: true },
    { id: 'comp', name: 'Compressor', icon: 'Gauge', active: true },
    { id: 'reverb', name: 'Reverb', icon: 'Waves', active: false },
    { id: 'delay', name: 'Delay', icon: 'Radio', active: false },
  ]);

  const [spectrumBars, setSpectrumBars] = useState<number[]>(
    Array.from({ length: 32 }, () => Math.random() * 60 + 20)
  );

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setSpectrumBars(Array.from({ length: 32 }, () => Math.random() * 60 + 20));
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const updateTrackVolume = (id: number, volume: number) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, volume } : t));
  };

  const updateTrackPan = (id: number, pan: number) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, pan } : t));
  };

  const toggleMute = (id: number) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, muted: !t.muted } : t));
  };

  const toggleSolo = (id: number) => {
    setTracks(tracks.map(t => t.id === id ? { ...t, solo: !t.solo } : t));
  };

  const toggleEffect = (id: string) => {
    setEffects(effects.map(e => e.id === id ? { ...e, active: !e.active } : e));
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in">
        <header className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center hover-scale">
              <Icon name="Music" size={24} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Audio Workstation</h1>
              <p className="text-sm text-muted-foreground">Professional DAW Interface</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hover-scale">
              <Icon name="FolderOpen" size={16} className="mr-2" />
              Open
            </Button>
            <Button variant="outline" size="sm" className="hover-scale">
              <Icon name="Save" size={16} className="mr-2" />
              Save
            </Button>
            <Button 
              size="sm" 
              className={`bg-primary transition-all duration-300 ${isPlaying ? 'scale-105 shadow-lg shadow-primary/50' : 'hover-scale'}`}
              onClick={togglePlayback}
            >
              <Icon name={isPlaying ? "Pause" : "Play"} size={16} className="mr-2" />
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-6 bg-card border-border hover:border-primary/50 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="Sliders" size={20} />
              Multi-Channel Mixer
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {tracks.map((track, index) => (
                <div 
                  key={track.id} 
                  className="flex flex-col items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border hover:border-primary/50 transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-full">
                    <div className="text-xs font-medium mb-2 text-center truncate transition-all duration-300" style={{ color: track.color }}>
                      {track.name}
                    </div>
                    <div className="flex justify-center mb-3">
                      <div 
                        className="w-2 h-24 bg-muted rounded-full relative overflow-hidden"
                      >
                        <div 
                          className="absolute bottom-0 w-full rounded-full transition-all duration-300 ease-out"
                          style={{ 
                            height: `${track.muted ? 0 : track.volume}%`,
                            backgroundColor: track.color,
                            boxShadow: `0 0 ${isPlaying && !track.muted ? '15px' : '10px'} ${track.color}${isPlaying && !track.muted ? 'CC' : '80'}`,
                            filter: isPlaying && !track.muted ? 'brightness(1.2)' : 'brightness(1)'
                          }}
                        />
                      </div>
                    </div>
                    <Slider
                      value={[track.volume]}
                      onValueChange={([value]) => updateTrackVolume(track.id, value)}
                      max={100}
                      step={1}
                      className="mb-3"
                      disabled={track.muted}
                    />
                    <div className="text-xs text-center text-muted-foreground mb-2 transition-all duration-300">
                      {track.volume}%
                    </div>
                  </div>
                  
                  <div className="w-full space-y-2">
                    <div className="text-xs text-muted-foreground text-center">Pan</div>
                    <Slider
                      value={[track.pan]}
                      onValueChange={([value]) => updateTrackPan(track.id, value)}
                      max={100}
                      step={1}
                      className="mb-1"
                      disabled={track.muted}
                    />
                    <div className="text-xs text-center text-muted-foreground">
                      {track.pan > 50 ? `R${track.pan - 50}` : track.pan < 50 ? `L${50 - track.pan}` : 'C'}
                    </div>
                  </div>

                  <div className="flex gap-1 w-full">
                    <Button
                      size="sm"
                      variant={track.muted ? "default" : "outline"}
                      className={`flex-1 h-7 text-xs transition-all duration-300 ${track.muted ? 'bg-accent shadow-lg' : 'hover:scale-105'}`}
                      onClick={() => toggleMute(track.id)}
                    >
                      M
                    </Button>
                    <Button
                      size="sm"
                      variant={track.solo ? "default" : "outline"}
                      className={`flex-1 h-7 text-xs transition-all duration-300 ${track.solo ? 'bg-secondary shadow-lg' : 'hover:scale-105'}`}
                      onClick={() => toggleSolo(track.id)}
                    >
                      S
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-card border-border hover:border-secondary/50 transition-all duration-300">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Icon name="Music2" size={20} />
              Master
            </h2>
            <div className="flex flex-col items-center gap-4">
              <div className="flex gap-4 w-full">
                <div className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-4 h-48 bg-muted rounded-full relative overflow-hidden"
                  >
                    <div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-primary to-secondary rounded-full transition-all duration-300 ease-out"
                      style={{ 
                        height: `${masterVolume}%`,
                        boxShadow: isPlaying ? '0 0 20px rgba(14, 165, 233, 0.8)' : '0 0 15px rgba(14, 165, 233, 0.6)',
                        filter: isPlaying ? 'brightness(1.3)' : 'brightness(1)'
                      }}
                    />
                  </div>
                  <div className="mt-3 text-sm font-medium">{masterVolume}%</div>
                </div>
                
                <div className="flex gap-1 items-end h-48">
                  {spectrumBars.map((height, i) => (
                    <div
                      key={i}
                      className="w-1 bg-gradient-to-t from-primary via-secondary to-accent rounded-sm transition-all duration-100 ease-out"
                      style={{ 
                        height: isPlaying ? `${height}%` : '20%',
                        opacity: isPlaying ? 0.7 + (height / 100) * 0.3 : 0.3,
                        boxShadow: isPlaying ? `0 0 ${height/10}px currentColor` : 'none'
                      }}
                    />
                  ))}
                </div>
              </div>

              <Slider
                value={[masterVolume]}
                onValueChange={([value]) => setMasterVolume(value)}
                max={100}
                step={1}
                className="w-full"
              />

              <div className="flex gap-2 w-full mt-2">
                <Button variant="outline" className="flex-1 hover-scale">
                  <Icon name="Volume2" size={16} />
                </Button>
                <Button variant="outline" className="flex-1 hover-scale">
                  <Icon name="Headphones" size={16} />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-card border-border hover:border-accent/50 transition-all duration-300">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="Sparkles" size={20} />
            Effects & Plugins
          </h2>
          <Tabs defaultValue="eq" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {effects.map(effect => (
                <TabsTrigger 
                  key={effect.id} 
                  value={effect.id}
                  className="flex items-center gap-2 transition-all duration-300"
                >
                  <Icon name={effect.icon as any} size={16} />
                  {effect.name}
                  {effect.active && (
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="eq" className="mt-4 animate-fade-in">
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4">
                  {['60Hz', '250Hz', '1kHz', '4kHz', '16kHz'].map((freq, i) => (
                    <div key={freq} className="flex flex-col items-center gap-2 hover:scale-105 transition-transform duration-300">
                      <div className="text-xs text-muted-foreground">{freq}</div>
                      <Slider
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        orientation="vertical"
                        className="h-32"
                      />
                      <div className="text-xs">0dB</div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <Button 
                    variant={effects.find(e => e.id === 'eq')?.active ? "default" : "outline"}
                    onClick={() => toggleEffect('eq')}
                    className="transition-all duration-300 hover-scale"
                  >
                    {effects.find(e => e.id === 'eq')?.active ? 'Enabled' : 'Disabled'}
                  </Button>
                  <Button variant="outline" size="sm" className="hover-scale">Reset</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="comp" className="mt-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Threshold</label>
                  <Slider defaultValue={[-20]} min={-60} max={0} step={1} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Ratio</label>
                  <Slider defaultValue={[4]} min={1} max={20} step={0.5} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Attack</label>
                  <Slider defaultValue={[5]} min={0} max={100} step={1} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Release</label>
                  <Slider defaultValue={[50]} min={0} max={1000} step={10} />
                </div>
                <div className="col-span-2 flex justify-between items-center pt-4 border-t border-border">
                  <Button 
                    variant={effects.find(e => e.id === 'comp')?.active ? "default" : "outline"}
                    onClick={() => toggleEffect('comp')}
                    className="transition-all duration-300 hover-scale"
                  >
                    {effects.find(e => e.id === 'comp')?.active ? 'Enabled' : 'Disabled'}
                  </Button>
                  <Button variant="outline" size="sm" className="hover-scale">Reset</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reverb" className="mt-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Room Size</label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Decay Time</label>
                  <Slider defaultValue={[30]} max={100} step={1} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Wet/Dry Mix</label>
                  <Slider defaultValue={[25]} max={100} step={1} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Pre-Delay</label>
                  <Slider defaultValue={[10]} max={100} step={1} />
                </div>
                <div className="col-span-2 flex justify-between items-center pt-4 border-t border-border">
                  <Button 
                    variant={effects.find(e => e.id === 'reverb')?.active ? "default" : "outline"}
                    onClick={() => toggleEffect('reverb')}
                    className="transition-all duration-300 hover-scale"
                  >
                    {effects.find(e => e.id === 'reverb')?.active ? 'Enabled' : 'Disabled'}
                  </Button>
                  <Button variant="outline" size="sm" className="hover-scale">Reset</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="delay" className="mt-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Delay Time</label>
                  <Slider defaultValue={[250]} max={2000} step={10} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Feedback</label>
                  <Slider defaultValue={[40]} max={100} step={1} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Wet/Dry Mix</label>
                  <Slider defaultValue={[30]} max={100} step={1} />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-muted-foreground">Filter</label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                </div>
                <div className="col-span-2 flex justify-between items-center pt-4 border-t border-border">
                  <Button 
                    variant={effects.find(e => e.id === 'delay')?.active ? "default" : "outline"}
                    onClick={() => toggleEffect('delay')}
                    className="transition-all duration-300 hover-scale"
                  >
                    {effects.find(e => e.id === 'delay')?.active ? 'Enabled' : 'Disabled'}
                  </Button>
                  <Button variant="outline" size="sm" className="hover-scale">Reset</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Index;
