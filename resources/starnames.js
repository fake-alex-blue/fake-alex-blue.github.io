function cleanNames() {
    let names = `
    Phygia
    Adranos       
    Nicodemus     
    Petrus        
    Sparax        
    Gallio        
    Philoxenus    
    Labienus      
    Vratish Expanse     
    Aurelius      
    Pleusicles    
    Canio
    Olympio       
    Crito
    Cerberus     
    Albinus       
    Ordius        
    Angelus       
    Calyponius    
    Epidicus      
    Draco
    Alcmena       
    Sollemnis     
    Lystiteles    
    Momus
    Eunomia      
    Miller      
    Truculentus   
    Pulcherius    
    Baker & Co.    
    Civilis
    Valx       
    Adrius        
    Telesinus     
    Stasimus      
    Faber
    Eutychus      
    Frontalis     
    Laurentius    
    Venustinius   
    Henricus      
    Vatia
    Staphyla      
    Frugius       
    Labrax        
    Amandus       
    Pyrgopolinices
    Pulcher
    Felicius
    Rex
    Planesium
    Arborius
    Lyconides
    Leptis
    Theodosius
    Aper
    Cleostrata
    Paterculus
    Callicles
    Dominicus
    Babudia
    Mercurialis
    Heqnenar
    Loha
    Richis
    Ithor
    Uenathfuhia
    Kocubba
    Nashledosol
    Dedabah
    H-9867
    Nexear
    Memtho
    Rinii
    Merrai
    QG-65
    OY-65
    Stadotin
    Fireot
    Itredshiali
    Cahuok
    Alares
    Ruriliax
    EU-31
    Me Al Saif
    Polkard
    Sheholo
    Dectihot
    Toirfias
    UJ-4
    Rukanab
    Meyyejo
    Delacruz's Planet
    Tahena
    Azalab
    Alagopol
    Morone
    Shitha
    Wasupoli
    Hehbe
    Ivano
    Odon
    Riiankot
    Rabdasor
    Lishu
    Yathenuiox
    Nothi
    Gir
    Veseiot
    Lorlay
    Boblay
    Gethos
    Shafatiukos
    Ecru Six
    Tyunne
    Ashoah
    Shil
    Huta Chidur
    Dithiar
    Raria
    Uebis
    Acameno
    Stamak
    Mimra
    Destor
    UB-21
    Shobi
    Weszam
    Otas
    Satpiyajis
    Suha
    Tesich
    XV-01
    R-10
    Ettuiat
    Nisma Gamma
    Nisma Beta
    Bizir
    PKA-149
    Hiterion
    Nisma Alpha
    Silax
    Unirik
    Nuradas
    Sidiske
    Erlatrix
    Lelased
    Tar Thochuchu
    Stamak Prime
    Waich
    New Manchester
    Laca
    Sherstinesh
    Roreong
    Punluga
    Cheil
    Azadi-e Jonoob
    Hillworld
    Ulyanhew
    Guwahias
    Huoda
    Akeku
    Xeqax
    Vadrit
    Hunar
    Owaz
    Sudi
    Nuelo
    New Dilaia
    Eil
    Hev
    Dehidesh
    Axlil Kiheat
    Pudeco
    New Thekov
    Loozeije`

names = names.split('\n')

for (let i = 0; i < names.length; i++) {
    if (names[i].length < 2) {
        names.splice(names[i], 1) 
    } else {
        names[i] = names[i].trim()
    }
}

return names;
}

export const starnames = cleanNames(); 